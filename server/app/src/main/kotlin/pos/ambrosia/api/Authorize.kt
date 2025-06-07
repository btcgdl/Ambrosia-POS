package pos.ambrosia.api

import io.ktor.http.*
import pos.ambrosia.services.AuthService
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.request.*
import pos.ambrosia.models.ApiResponse
import pos.ambrosia.models.AuthRequest
import io.ktor.server.auth.*

fun Application.configureAuth() {
    routing {
        route("/auth") {
            auth()
        }
    }
}

fun Route.auth() {
    authenticate("auth-basic") {
        post("/login") {
            val loginRequest = call.receive<AuthRequest>()
            val authService = AuthService()
            val authResponse = authService.login(loginRequest)
            call.respond(HttpStatusCode.OK, authResponse)
        }
    
        post("/logout") {
            call.respond(HttpStatusCode.NoContent)
        }
    }
}
