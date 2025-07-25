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
import pos.ambrosia.db.DatabaseConnection
import pos.ambrosia.models.Payment
import pos.ambrosia.models.TicketPayment
import pos.ambrosia.services.PaymentService
import pos.ambrosia.services.TicketPaymentService

fun Application.configurePayments() {
    val connection: Connection = DatabaseConnection.getConnection()
    val paymentService = PaymentService(connection)
    val ticketPaymentService = TicketPaymentService(connection)
    routing { route("/payments") { payments(paymentService, ticketPaymentService) } }
}

fun Route.payments(paymentService: PaymentService, ticketPaymentService: TicketPaymentService) {
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
                call.respond(HttpStatusCode.NotFound, "Payment not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    post("") {
        val payment = call.receive<Payment>()
        val paymentId = paymentService.addPayment(payment)
        if (paymentId != null) {
            call.respond(
                    HttpStatusCode.Created,
                    mapOf("id" to paymentId, "message" to "Payment added successfully")
            )
        } else {
            call.respond(HttpStatusCode.BadRequest, "Failed to create payment")
        }
    }
    put("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val updatedPayment = call.receive<Payment>().copy(id = id)
            val isUpdated = paymentService.updatePayment(updatedPayment)
            if (isUpdated) {
                call.respond(HttpStatusCode.OK, "Payment updated successfully")
            } else {
                call.respond(HttpStatusCode.BadRequest, "Failed to update payment")
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
                call.respond(
                        HttpStatusCode.BadRequest,
                        "Failed to delete payment or payment is in use"
                )
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    get("/methods") {
        val paymentMethods = paymentService.getPaymentMethods()
        if (paymentMethods.isEmpty()) {
            call.respond(HttpStatusCode.NoContent, "No payment methods found")
            return@get
        }
        call.respond(HttpStatusCode.OK, paymentMethods)
    }
    get("/methods/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val paymentMethod = paymentService.getPaymentMethodById(id)
            if (paymentMethod != null) {
                call.respond(HttpStatusCode.OK, paymentMethod)
            } else {
                call.respond(HttpStatusCode.NotFound, "Payment method not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    get("/currencies") {
        val currencies = paymentService.getCurrencies()
        if (currencies.isEmpty()) {
            call.respond(HttpStatusCode.NoContent, "No currencies found")
            return@get
        }
        call.respond(HttpStatusCode.OK, currencies)
    }
    get("/currencies/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val currency = paymentService.getCurrencyById(id)
            if (currency != null) {
                call.respond(HttpStatusCode.OK, currency)
            } else {
                call.respond(HttpStatusCode.NotFound, "Currency not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }

    // Ticket Payment endpoints - manage relationships between payments and tickets
    post("/ticket-payments") {
        val ticketPayment = call.receive<TicketPayment>()
        val isAdded = ticketPaymentService.addTicketPayment(ticketPayment)
        if (isAdded) {
            call.respond(HttpStatusCode.Created, "Ticket payment relationship created successfully")
        } else {
            call.respond(HttpStatusCode.BadRequest, "Failed to create ticket payment relationship")
        }
    }

    get("/ticket-payments/by-ticket/{ticketId}") {
        val ticketId = call.parameters["ticketId"]
        if (ticketId != null) {
            val payments = ticketPaymentService.getTicketPaymentsByTicket(ticketId)
            if (payments.isEmpty()) {
                call.respond(HttpStatusCode.NoContent, "No payments found for this ticket")
                return@get
            }
            call.respond(HttpStatusCode.OK, payments)
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ticket ID")
        }
    }

    get("/ticket-payments/by-payment/{paymentId}") {
        val paymentId = call.parameters["paymentId"]
        if (paymentId != null) {
            val tickets = ticketPaymentService.getTicketPaymentsByPayment(paymentId)
            if (tickets.isEmpty()) {
                call.respond(HttpStatusCode.NoContent, "No tickets found for this payment")
                return@get
            }
            call.respond(HttpStatusCode.OK, tickets)
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed payment ID")
        }
    }

    delete("/ticket-payments") {
        val paymentId = call.request.queryParameters["paymentId"]
        val ticketId = call.request.queryParameters["ticketId"]

        if (paymentId != null && ticketId != null) {
            val isDeleted = ticketPaymentService.deleteTicketPayment(paymentId, ticketId)
            if (isDeleted) {
                call.respond(HttpStatusCode.OK, "Ticket payment relationship deleted successfully")
            } else {
                call.respond(
                        HttpStatusCode.BadRequest,
                        "Failed to delete ticket payment relationship"
                )
            }
        } else {
            call.respond(
                    HttpStatusCode.BadRequest,
                    "Missing paymentId or ticketId query parameters"
            )
        }
    }

    delete("/ticket-payments/by-ticket/{ticketId}") {
        val ticketId = call.parameters["ticketId"]
        if (ticketId != null) {
            val isDeleted = ticketPaymentService.deleteTicketPaymentsByTicket(ticketId)
            call.respond(HttpStatusCode.OK, "All payment relationships for ticket deleted")
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ticket ID")
        }
    }
}
