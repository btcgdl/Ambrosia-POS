package pos.ambrosia.api

import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.sql.Connection
import pos.ambrosia.db.connectToSqlite
import pos.ambrosia.logger
import pos.ambrosia.models.Shift
import pos.ambrosia.services.ShiftService
import pos.ambrosia.utils.UserNotFoundException

fun Application.configureShifts() {
    val connection: Connection = connectToSqlite()
    val shiftService = ShiftService(connection)
    routing { route("/shifts") { shifts(shiftService) } }
}

fun Route.shifts(shiftService: ShiftService) {
    get("") {
        val shifts = shiftService.getShifts()
        if (shifts.isEmpty()) {
            call.respond(HttpStatusCode.NoContent, "No shifts found")
            return@get
        }
        call.respond(HttpStatusCode.OK, shifts)
    }
    get("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val shift = shiftService.getShiftById(id)
            if (shift != null) {
                call.respond(HttpStatusCode.OK, shift)
            } else {
                throw UserNotFoundException()
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    post("") {
        val shift = call.receive<Shift>()
        shiftService.addShift(shift)
        call.respond(HttpStatusCode.Created, "Shift added successfully")
    }
    put("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val updatedShift = call.receive<Shift>()
            val isUpdated = shiftService.updateShift(updatedShift)
            logger.info(isUpdated.toString())
            if (isUpdated) {
                call.respond(HttpStatusCode.OK, "Shift updated successfully")
            } else {
                call.respond(HttpStatusCode.NotFound, "Shift not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    delete("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val isDeleted = shiftService.deleteShift(id)
            if (isDeleted) {
                call.respond(HttpStatusCode.OK, "Shift deleted successfully")
            } else {
                call.respond(HttpStatusCode.NotFound, "Shift not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
}
