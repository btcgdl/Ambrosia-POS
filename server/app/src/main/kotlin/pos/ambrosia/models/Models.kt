package pos.ambrosia.models

import kotlinx.serialization.Serializable

@Serializable
data class AuthRequest(val role: String, val password: String)

@Serializable
data class Auth(val message: String, val id: String, val role: String)

@Serializable
data class ApiResponse<T>(val data: T? = null)

@Serializable
data class Message(val message: String)

@Serializable
data class User(val id: String, val name: String, val pin: Int)