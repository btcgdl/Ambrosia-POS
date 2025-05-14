package pos.ambrosia.models

import kotlinx.serialization.Serializable

@Serializable
data class AuthRequest(val role: String, val password: String)

@Serializable
data class AuthResponse(val message: String, val id: String, val role: String)

@Serializable
data class ApiResponse<T>(val data: T? = null)

@Serializable
data class Message(val message: String)