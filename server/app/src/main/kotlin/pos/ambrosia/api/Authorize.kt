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
data class LoginRequest(val role: String, val password: String)

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
        val loginRequest = call.receive<LoginRequest>()
        val role = loginRequest.role
        val password = loginRequest.password
        if (role == "admin" && password == "admin") {
            call.respondText("Login successful for role: $role", 
                status = HttpStatusCode.OK)
        } else {
            call.respondText("Invalid credentials", 
                status = HttpStatusCode.Unauthorized)
        }
    }
    post("/logout") {
        call.respondText("Logout successful", status = HttpStatusCode.OK)
    }
}
