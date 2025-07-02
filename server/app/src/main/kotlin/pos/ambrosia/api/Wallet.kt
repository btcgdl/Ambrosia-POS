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
import pos.ambrosia.models.Phoenix.PayInvoiceRequest
import pos.ambrosia.models.Phoenix.PayOfferRequest
import pos.ambrosia.models.Phoenix.PayOnchainRequest

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
    post("/payinvoice"){
        val request = call.receive<PayInvoiceRequest>()
        val result = phoenixService.payInvoice(request)
        call.respond(HttpStatusCode.OK, result)
    }
    post("/payoffer"){
        val request = call.receive<PayOfferRequest>()
        val result = phoenixService.payOffer(request)
        call.respond(HttpStatusCode.OK, result)
    }
    post("/payonchain") {
        val request = call.receive<PayOnchainRequest>()
        val result = phoenixService.payOnchain(request)
        call.respond(HttpStatusCode.OK, result)
    }
    post("bumpfee") {
        val feerateSatByte = call.receive<Int>()
        val result = phoenixService.bumpOnchainFees(feerateSatByte)
        call.respond(HttpStatusCode.OK, result)
    }
}