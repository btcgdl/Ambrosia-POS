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
import pos.ambrosia.models.Payment
import pos.ambrosia.services.PaymentService
import pos.ambrosia.utils.UserNotFoundException
import pos.ambrosia.db.DatabaseConnection

fun Application.configurePayments() {
    val connection: Connection = DatabaseConnection.getConnection()
    val paymentService = PaymentService(connection)
    routing { route("/payments") { payments(paymentService) } }
}

fun Route.payments(paymentService: PaymentService) {
    get("") {
        val payments = paymentService.getPayments()
        if (payments.isEmpty()) {
            call.respond(HttpStatusCode.NoContent, "No payments found")
            return@get
        }
        call.respond(HttpStatusCode.OK, payments)
    }
    get("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val payment = paymentService.getPaymentById(id)
            if (payment != null) {
                call.respond(HttpStatusCode.OK, payment)
            } else {
                throw UserNotFoundException()
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    post("") {
        val payment = call.receive<Payment>()
        paymentService.addPayment(payment)
        call.respond(HttpStatusCode.Created, "Payment added successfully")
    }
    put("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val updatedPayment = call.receive<Payment>()
            val isUpdated = paymentService.updatePayment(updatedPayment)
            logger.info(isUpdated.toString())
            if (isUpdated) {
                call.respond(HttpStatusCode.OK, "Payment updated successfully")
            } else {
                call.respond(HttpStatusCode.NotFound, "Payment not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    delete("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val isDeleted = paymentService.deletePayment(id)
            if (isDeleted) {
                call.respond(HttpStatusCode.OK, "Payment deleted successfully")
            } else {
                call.respond(HttpStatusCode.NotFound, "Payment not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
}
