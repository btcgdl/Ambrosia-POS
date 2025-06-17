package pos.ambrosia.models

import kotlinx.serialization.Serializable

@Serializable data class AuthRequest(val name: String, val pin: String)

@Serializable data class TokenResponse(val accessToken: String, val refreshToken: String)

@Deprecated("This class is deprecated and will be removed")
@Serializable
data class Auth(val id: String, val name: String)

@Serializable data class Message(val message: String)

@Serializable
data class User(
        val id: String,
        val name: String,
        val pin: String,
        val refreshToken: String?,
        val role: String?
)

