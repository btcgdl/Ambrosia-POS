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
import pos.ambrosia.logger
import pos.ambrosia.models.Shift
import pos.ambrosia.services.ShiftService
import pos.ambrosia.db.DatabaseConnection

fun Application.configureShifts() {
    val connection: Connection = DatabaseConnection.getConnection()
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
        if (id == null) {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
            return@get
        }
        
        val shift = shiftService.getShiftById(id)
        if (shift == null) {
            call.respond(HttpStatusCode.NotFound, "Shift not found")
            return@get
        }
        
        call.respond(HttpStatusCode.OK, shift)
    }
    post("") {
        val shift = call.receive<Shift>()
        val createdShift = shiftService.addShift(shift)
        call.respond(HttpStatusCode.Created, mapOf("shiftId" to createdShift))
    }
    put("/{id}") {
        val id = call.parameters["id"]
        if (id == null) {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
            return@put
        }
        
        val updatedShift = call.receive<Shift>()
        val isUpdated = shiftService.updateShift(updatedShift)
        logger.info(isUpdated.toString())
        
        if (!isUpdated) {
            call.respond(HttpStatusCode.NotFound, "Shift not found")
            return@put
        }
        
        call.respond(HttpStatusCode.OK, "Shift updated successfully")
    }
    delete("/{id}") {
        val id = call.parameters["id"]
        if (id == null) {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
            return@delete
        }
        
        val isDeleted = shiftService.deleteShift(id)
        if (!isDeleted) {
            call.respond(HttpStatusCode.NotFound, "Shift not found")
            return@delete
        }
        
        call.respond(HttpStatusCode.OK, "Shift deleted successfully")
    }
}
