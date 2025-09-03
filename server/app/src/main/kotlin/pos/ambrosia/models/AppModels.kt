package pos.ambrosia.models

import kotlinx.serialization.Serializable

@Serializable data class AuthRequest(val name: String, val pin: String)

@Serializable
data class AuthResponse(
        val id: String? = null,
        val name: String,
        val refreshToken: String? = null,
        val role: String? = null,
        val isAdmin: Boolean? = false
)

@Serializable data class TokenResponse(val accessToken: String, val refreshToken: String)

@Serializable data class UserResponse(val id: String, val name: String, val role: String)

@Serializable data class Message(val message: String)

@Serializable
data class User(
        val id: String? = null,
        val name: String,
        val pin: String,
        val refreshToken: String? = null,
        val role: String? = null
)

@Serializable
data class Role(
        val id: String? = null,
        val role: String,
        val password: String? = null,
        val isAdmin: Boolean? = false
)

@Serializable data class Space(val id: String? = null, val name: String)

@Serializable
data class Table(
        val id: String? = null,
        val name: String,
        val status: String? = null,
        val space_id: String,
        val order_id: String? = null
)

@Serializable
data class Dish(
        val id: String? = null,
        val name: String,
        val price: Double,
        val category_id: String
)

@Serializable
data class Ingredient(
        val id: String? = null,
        val name: String,
        val category_id: String,
        val quantity: Double,
        val unit: String,
        val low_stock_threshold: Double,
        val cost_per_unit: Double
)

@Serializable data class IngredientCategory(val id: String? = null, val name: String)

@Serializable
data class Supplier(
        val id: String? = null,
        val name: String,
        val contact: String,
        val phone: String,
        val email: String,
        val address: String
)

@Serializable
data class Order(
        val id: String? = null,
        val user_id: String,
        val table_id: String? = null,
        val waiter: String,
        val status: String,
        val total: Double,
        val created_at: String
)

@Serializable
data class OrderDish(
        val id: String? = null,
        val order_id: String,
        val dish_id: String,
        val price_at_order: Double,
        val notes: String? = null,
        val status: String,
        val should_prepare: Boolean
)

// NEW: DTO for adding dishes to an order
@Serializable
data class AddOrderDishRequest(
        val dish_id: String,
        val price_at_order: Double,
        val notes: String? = null
)

data class CompleteOrder(val order: Order, val dishes: List<OrderDish>)

data class OrderWithDishesRequest(val order: Order, val dishes: List<OrderDish>)

@Serializable
data class Payment(
        val id: String? = null,
        val method_id: String,
        val currency_id: String,
        val transaction_id: String? = null,
        val amount: Double,
)

@Serializable data class PaymentMethod(val id: String? = null, val name: String)

@Serializable
data class Ticket(
        val id: String? = null,
        val order_id: String,
        val user_id: String,
        val ticket_date: String,
        val status: Int,
        val total_amount: Double,
        val notes: String
)

@Serializable data class Currency(val id: String? = null, val acronym: String)

@Serializable data class TicketPayment(val payment_id: String, val ticket_id: String)

@Serializable
data class Shift(
        val id: String? = null,
        val user_id: String,
        val shift_date: String,
        val start_time: String,
        val end_time: String? = null,
        val notes: String
)

@Serializable
data class DishCategory(
        val id: String? = null,
        val name: String,
)
