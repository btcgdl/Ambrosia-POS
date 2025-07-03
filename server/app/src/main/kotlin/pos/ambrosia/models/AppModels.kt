package pos.ambrosia.models

import kotlinx.serialization.Serializable

@Serializable data class AuthRequest(val name: String, val pin: String)

@Serializable data class TokenResponse(val accessToken: String, val refreshToken: String)

@Serializable data class Message(val message: String)

@Serializable
data class User(
        val id: String?,
        val name: String,
        val pin: String,
        val refreshToken: String?,
        val role: String?
)

@Serializable data class Role(val id: String?, val role: String, val password: String)

@Serializable data class Space(val id: String?, val name: String)

@Serializable
data class Table(
        val id: String?,
        val name: String,
        val status: String?,
        val space_id: String,
        val order_id: String
)

@Serializable
data class Dish(val id: String?, val name: String, val price: Float, val category_id: String)

@Serializable
data class Ingredient(
        val id: String?,
        val naame: String,
        val category_id: String,
        val quantity: Float,
        val unit: String,
        val low_stock_threshold: Float,
        val cost_per_unit: Float
)

@Serializable
data class Supplier(
        val id: String?,
        val name: String,
        val contact: String,
        val phone: String,
        val email: String,
        val address: String
)

@Serializable
data class Order(
        val id: String?,
        val user_id: String,
        val table_id: String,
        val waiter: String,
        val status: String,
        val total: Float,
        val created_at: String
)

@Serializable data class Payment(val id: String?, val currency: String, val name: String)

@Serializable
data class Ticket(
        val id: String?,
        val order_id: String,
        val user_id: String,
        val ticket_date: String,
        val status: Int,
        val total_amount: Float,
        val notes: String
)

@Serializable
data class Shift(
        val id: String?,
        val user_id: String,
        val shift_date: String,
        val start_time: String,
        val end_time: String?,
        val notes: String
)
