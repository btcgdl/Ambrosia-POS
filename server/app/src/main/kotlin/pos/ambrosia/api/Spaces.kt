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
import pos.ambrosia.models.Space
import pos.ambrosia.services.SpaceService
import pos.ambrosia.db.DatabaseConnection

fun Application.configureSpaces() {
    val connection: Connection = DatabaseConnection.getConnection()
    val spaceService = SpaceService(connection)
    routing { route("/spaces") { spaces(spaceService) } }
}

fun Route.spaces(spaceService: SpaceService) {
    get("") {
        val spaces = spaceService.getSpaces()
        if (spaces.isEmpty()) {
            call.respond(HttpStatusCode.NoContent, "No spaces found")
            return@get
        }
        call.respond(HttpStatusCode.OK, spaces)
    }
    get("/{id}") {
        val id = call.parameters["id"]
        if (id == null) {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
            return@get
        }
        
        val space = spaceService.getSpaceById(id)
        if (space == null) {
            call.respond(HttpStatusCode.NotFound, "Space not found")
            return@get
        }
        
        call.respond(HttpStatusCode.OK, space)
    }
    post("") {
        val space = call.receive<Space>()
        spaceService.addSpace(space)
        call.respond(HttpStatusCode.Created, "Space added successfully")
    }
    put("/{id}") {
        val id = call.parameters["id"]
        if (id == null) {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
            return@put
        }
        
        val updatedSpace = call.receive<Space>()
        val isUpdated = spaceService.updateSpace(updatedSpace)
        logger.info(isUpdated.toString())
        
        if (!isUpdated) {
            call.respond(HttpStatusCode.NotFound, "Space not found")
            return@put
        }
        
        call.respond(HttpStatusCode.OK, "Space updated successfully")
    }
    delete("/{id}") {
        val id = call.parameters["id"]
        if (id == null) {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
            return@delete
        }
        
        val isDeleted = spaceService.deleteSpace(id)
        if (!isDeleted) {
            call.respond(HttpStatusCode.BadRequest, "Space not found")
            return@delete
        }
        
        call.respond(HttpStatusCode.OK, "Space deleted successfully")
    }
}
