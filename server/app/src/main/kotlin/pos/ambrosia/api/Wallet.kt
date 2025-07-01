package pos.ambrosia.api

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import pos.ambrosia.services.PhoenixService
import pos.ambrosia.models.Phoenix.CreateInvoiceRequest

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
    get("/getinfo") {
        val nodeInfo = phoenixService.getNodeInfo()
        call.respond(HttpStatusCode.OK, nodeInfo)
    }
    // Get wallet balance
    get("/getbalance") {
        val balance = phoenixService.getBalance()
        call.respond(HttpStatusCode.OK, balance)
    }
    post("/createinvoice"){
        val request = call.receive<CreateInvoiceRequest>()
        val invoice = phoenixService.createInvoice(request)
        call.respond(HttpStatusCode.OK, invoice)
    }
}