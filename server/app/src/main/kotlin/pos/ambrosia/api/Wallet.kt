package pos.ambrosia.api

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import pos.ambrosia.services.PhoenixService

fun Application.configureWallet() {
    val phoenixService = PhoenixService()
    
    routing {
        route("/wallet") {
            wallet(phoenixService)
        }
    }
}

fun Route.wallet(phoenixService: PhoenixService) {
    
    // Get wallet/node info
    get("/info") {
        val nodeInfo = phoenixService.getNodeInfo()
        if (nodeInfo != null) {
            call.respond(HttpStatusCode.OK, nodeInfo)
        } else {
            call.respond(HttpStatusCode.ServiceUnavailable, "Unable to connect to Phoenix node")
        }
    }

    // Get wallet balance
    get("/balance") {
        val balance = phoenixService.getBalance()
        if (balance != null) {
            call.respond(HttpStatusCode.OK, balance)
        } else {
            call.respond(HttpStatusCode.ServiceUnavailable, "Unable to get balance from Phoenix node")
        }
    }
}

@Serializable
data class CreateInvoiceApiRequest(
    val amountSat: Long,
    val description: String
)
