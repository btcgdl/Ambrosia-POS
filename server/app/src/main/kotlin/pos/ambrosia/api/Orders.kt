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
import pos.ambrosia.models.Order
import pos.ambrosia.services.OrderService
import pos.ambrosia.utils.UserNotFoundException

fun Application.configureOrders() {
    val connection: Connection = connectToSqlite()
    val orderService = OrderService(connection)
    routing { route("/orders") { orders(orderService) } }
}

fun Route.orders(orderService: OrderService) {
    get("") {
        val orders = orderService.getOrders()
        if (orders.isEmpty()) {
            call.respond(HttpStatusCode.NoContent, "No orders found")
            return@get
        }
        call.respond(HttpStatusCode.OK, orders)
    }
    get("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val order = orderService.getOrderById(id)
            if (order != null) {
                call.respond(HttpStatusCode.OK, order)
            } else {
                throw UserNotFoundException()
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    post("") {
        val order = call.receive<Order>()
        val generatedOrder = orderService.addOrder(order)
        logger.info(generatedOrder)
        call.respond(HttpStatusCode.Created, mapOf("orderId" to generatedOrder))
    }
    put("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val updatedOrder = call.receive<Order>()
            val isUpdated = orderService.updateOrder(updatedOrder)
            logger.info(isUpdated.toString())
            if (isUpdated) {
                call.respond(HttpStatusCode.OK, "Order updated successfully")
            } else {
                call.respond(HttpStatusCode.NotFound, "Order not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    delete("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            orderService.deleteOrder(id)
            call.respond(HttpStatusCode.NoContent, "Order deleted successfully")
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    get("/user/{userId}") {
        val userId = call.parameters["userId"]
        if (userId != null) {
            val orders = orderService.getOrdersByUserId(userId)
            if (orders.isNotEmpty()) {
                call.respond(HttpStatusCode.OK, orders)
            } else {
                call.respond(HttpStatusCode.NoContent, "No orders found for user")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed user ID")
        }
    }
    get("/table/{tableId}") {
        val tableId = call.parameters["tableId"]
        if (tableId != null) {
            val orders = orderService.getOrdersByTableId(tableId)
            if (orders.isNotEmpty()) {
                call.respond(HttpStatusCode.OK, orders)
            } else {
                call.respond(HttpStatusCode.NoContent, "No orders found for table")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed table ID")
        }
    }
    get("/total_sales/{date}") {
        val date = call.parameters["date"]
        if (date != null) {
            val totalSales = orderService.getTotalSalesByDate(date)
            call.respond(HttpStatusCode.OK, totalSales)
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed date")
        }
    }
}
