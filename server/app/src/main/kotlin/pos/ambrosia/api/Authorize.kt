package pos.ambrosia.api

import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.request.*
import kotlinx.serialization.Serializable

@Serializable
data class AuthRequest(val role: String, val password: String)

@Serializable
data class AuthResponse(val message: String, val id: String, val role: String)

fun Application.configureAuth() {
    routing {
        route("/auth") {
            authenticate()
        }
        install(ContentNegotiation) {
            json()
        }
    }
}

fun Route.authenticate() {
    post("/login") {
        val loginRequest = call.receive<AuthRequest>()
        val role = loginRequest.role
        val password = loginRequest.password
        if (role == "admin" && password == "admin") {
            // Add allow origins
            call.response.headers.append(HttpHeaders.AccessControlAllowOrigin, "*")
            call.respond(AuthResponse("Login successful", "12345", role))
        } else {
            call.respondText("{\"mensaje\": \"Invalid credentials\"}", contentType = ContentType.Application.Json,
                status = HttpStatusCode.Unauthorized)
        }
    }
    post("/logout") {
        call.respondText("{\"mensaje\": \"Logout successful\"}", contentType = ContentType.Application.Json,
            status = HttpStatusCode.OK)
    }
}
