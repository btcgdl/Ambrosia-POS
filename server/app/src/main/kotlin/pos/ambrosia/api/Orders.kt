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
import pos.ambrosia.models.OrderDish
import pos.ambrosia.models.CompleteOrder
import pos.ambrosia.models.OrderWithDishesRequest
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
    
    // Get complete order with dishes
    get("/{id}/complete") {
        val id = call.parameters["id"]
        if (id != null) {
            val order = orderService.getOrderById(id)
            if (order != null) {
                val dishes = orderService.getOrderDishes(id)
                val completeOrder = CompleteOrder(order, dishes)
                call.respond(HttpStatusCode.OK, completeOrder)
            } else {
                call.respond(HttpStatusCode.NotFound, "Order not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    
    post("") {
        val order = call.receive<Order>()
        val orderId = orderService.addOrder(order)
        if (orderId != null) {
            call.respond(HttpStatusCode.Created, mapOf("message" to "Order added successfully", "id" to orderId))
        } else {
            call.respond(HttpStatusCode.BadRequest, "Failed to create order")
        }
    }
    
    // Create order with dishes
    post("/with-dishes") {
        val request = call.receive<OrderWithDishesRequest>()
        val orderId = orderService.addOrder(request.order)
        if (orderId != null) {
            val dishesAdded = orderService.addDishesToOrder(orderId, request.dishes)
            if (dishesAdded) {
                // Update order total based on dishes
                orderService.updateOrderTotal(orderId)
                call.respond(HttpStatusCode.Created, mapOf(
                    "message" to "Order with dishes created successfully", 
                    "id" to orderId
                ))
            } else {
                call.respond(HttpStatusCode.BadRequest, "Order created but failed to add some dishes")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Failed to create order")
        }
    }
    
    put("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val updatedOrder = call.receive<Order>()
            val orderWithId = updatedOrder.copy(id = id)
            val isUpdated = orderService.updateOrder(orderWithId)
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
            val isDeleted = orderService.deleteOrder(id)
            if (isDeleted) {
                call.respond(HttpStatusCode.NoContent, "Order deleted successfully")
            } else {
                call.respond(HttpStatusCode.NotFound, "Order not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    
    // Order Dishes Management
    get("/{id}/dishes") {
        val orderId = call.parameters["id"]
        if (orderId != null) {
            val dishes = orderService.getOrderDishes(orderId)
            if (dishes.isNotEmpty()) {
                call.respond(HttpStatusCode.OK, dishes)
            } else {
                call.respond(HttpStatusCode.NoContent, "No dishes found for this order")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed order ID")
        }
    }
    
    post("/{id}/dishes") {
        val orderId = call.parameters["id"]
        if (orderId != null) {
            val dishes = call.receive<List<OrderDish>>()
            val added = orderService.addDishesToOrder(orderId, dishes)
            if (added) {
                // Update order total
                orderService.updateOrderTotal(orderId)
                call.respond(HttpStatusCode.Created, "Dishes added to order successfully")
            } else {
                call.respond(HttpStatusCode.BadRequest, "Failed to add dishes to order")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed order ID")
        }
    }
    
    put("/{id}/dishes/{dishId}") {
        val orderId = call.parameters["id"]
        val dishId = call.parameters["dishId"]
        if (orderId != null && dishId != null) {
            val updatedDish = call.receive<OrderDish>()
            val dishWithId = updatedDish.copy(id = dishId, order_id = orderId)
            val isUpdated = orderService.updateOrderDish(dishWithId)
            if (isUpdated) {
                // Update order total
                orderService.updateOrderTotal(orderId)
                call.respond(HttpStatusCode.OK, "Order dish updated successfully")
            } else {
                call.respond(HttpStatusCode.NotFound, "Order dish not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed IDs")
        }
    }
    
    delete("/{id}/dishes/{dishId}") {
        val orderId = call.parameters["id"]
        val dishId = call.parameters["dishId"]
        if (orderId != null && dishId != null) {
            val isDeleted = orderService.removeOrderDish(dishId)
            if (isDeleted) {
                // Update order total
                orderService.updateOrderTotal(orderId)
                call.respond(HttpStatusCode.NoContent, "Dish removed from order successfully")
            } else {
                call.respond(HttpStatusCode.NotFound, "Order dish not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed IDs")
        }
    }
    
    delete("/{id}/dishes") {
        val orderId = call.parameters["id"]
        if (orderId != null) {
            val isDeleted = orderService.removeAllOrderDishes(orderId)
            if (isDeleted) {
                // Update order total to 0
                orderService.updateOrderTotal(orderId)
                call.respond(HttpStatusCode.NoContent, "All dishes removed from order successfully")
            } else {
                call.respond(HttpStatusCode.InternalServerError, "Failed to remove dishes from order")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed order ID")
        }
    }
    
    // Calculate and update order total
    put("/{id}/calculate-total") {
        val orderId = call.parameters["id"]
        if (orderId != null) {
            val newTotal = orderService.calculateOrderTotal(orderId)
            val isUpdated = orderService.updateOrderTotal(orderId)
            if (isUpdated) {
                call.respond(HttpStatusCode.OK, mapOf(
                    "message" to "Order total updated successfully",
                    "total" to newTotal
                ))
            } else {
                call.respond(HttpStatusCode.NotFound, "Order not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed order ID")
        }
    }
    
    // Existing endpoints
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
            call.respond(HttpStatusCode.OK, mapOf("date" to date, "total_sales" to totalSales))
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed date")
        }
    }
}
