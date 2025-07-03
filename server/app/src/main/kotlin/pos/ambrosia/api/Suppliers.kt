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
import pos.ambrosia.models.Supplier
import pos.ambrosia.services.SupplierService
import pos.ambrosia.utils.UserNotFoundException

fun Application.configureSuppliers() {
    val connection: Connection = connectToSqlite()
    val supplierService = SupplierService(connection)
    routing { route("/suppliers") { suppliers(supplierService) } }
}

fun Route.suppliers(supplierService: SupplierService) {
    get("") {
        val suppliers = supplierService.getSuppliers()
        if (suppliers.isEmpty()) {
            call.respond(HttpStatusCode.NoContent, "No suppliers found")
            return@get
        }
        call.respond(HttpStatusCode.OK, suppliers)
    }
    get("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val supplier = supplierService.getSupplierById(id)
            if (supplier != null) {
                call.respond(HttpStatusCode.OK, supplier)
            } else {
                throw UserNotFoundException()
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    post("") {
        val supplier = call.receive<Supplier>()
        supplierService.addSupplier(supplier)
        call.respond(HttpStatusCode.Created, "Supplier added successfully")
    }
    put("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val updatedSupplier = call.receive<Supplier>()
            val isUpdated = supplierService.updateSupplier(updatedSupplier)
            logger.info(isUpdated.toString())
            if (isUpdated) {
                call.respond(HttpStatusCode.OK, "Supplier updated successfully")
            } else {
                call.respond(HttpStatusCode.NotFound, "Supplier not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    delete("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val isDeleted = supplierService.deleteSupplier(id)
            if (isDeleted) {
                call.respond(HttpStatusCode.OK, "Supplier deleted successfully")
            } else {
                call.respond(HttpStatusCode.NotFound, "Supplier not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
}
