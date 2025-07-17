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
import pos.ambrosia.models.Table
import pos.ambrosia.services.TableService
import pos.ambrosia.utils.UserNotFoundException

fun Application.configureTables() {
    val connection: Connection = connectToSqlite()
    val tableService = TableService(connection)
    routing { route("/tables") { tables(tableService) } }
}

fun Route.tables(tableService: TableService) {
    get("") {
        val tables = tableService.getTables()
        if (tables.isEmpty()) {
            call.respond(HttpStatusCode.NoContent, "No tables found")
            return@get
        }
        call.respond(HttpStatusCode.OK, tables)
    }
    get("/by-space/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val tables = tableService.getTablesBySpace(spaceId = id)
            if (tables.isNotEmpty()) {
                call.respond(HttpStatusCode.OK, tables)
            } else {
                call.respond(HttpStatusCode.NoContent, "No tables found for space ID: $id")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    get("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val table = tableService.getTableById(id)
            if (table != null) {
                call.respond(HttpStatusCode.OK, table)
            } else {
                throw UserNotFoundException()
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    post("") {
        val table = call.receive<Table>()
        tableService.addTable(table)
        call.respond(HttpStatusCode.Created, "Table added successfully")
    }
    put("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val updatedTable = call.receive<Table>()
            val isUpdated = tableService.updateTable(updatedTable)
            logger.info(isUpdated.toString())
            if (isUpdated) {
                call.respond(HttpStatusCode.OK, "Table updated successfully")
            } else {
                throw UserNotFoundException()
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    delete("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val isDeleted = tableService.deleteTable(id)
            if (isDeleted) {
                call.respond(HttpStatusCode.OK, "Table deleted successfully")
            } else {
                throw UserNotFoundException()
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
}
