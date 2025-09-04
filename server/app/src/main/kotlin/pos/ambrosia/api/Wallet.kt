package pos.ambrosia.api

import io.ktor.http.*
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.sql.Connection
import pos.ambrosia.db.DatabaseConnection
import pos.ambrosia.models.Phoenix.CreateInvoiceRequest
import pos.ambrosia.models.Phoenix.PayInvoiceRequest
import pos.ambrosia.models.Phoenix.PayOfferRequest
import pos.ambrosia.models.Phoenix.PayOnchainRequest
import pos.ambrosia.services.PhoenixService
import pos.ambrosia.services.TokenService
import pos.ambrosia.utils.authenticateAdmin
import pos.ambrosia.utils.authenticateWallet
import pos.ambrosia.utils.getCurrentUser

fun Application.configureWallet() {
  val connection: Connection = DatabaseConnection.getConnection()
  val phoenixService = PhoenixService()
  val tokenService = TokenService(environment, connection)

  routing { route("/wallet") { wallet(phoenixService, tokenService) } }
}

fun Route.wallet(phoenixService: PhoenixService, tokenService: TokenService) {
  authenticate("auth-jwt") {
    post("/createinvoice") {
      val request = call.receive<CreateInvoiceRequest>()
      val invoice = phoenixService.createInvoice(request)
      call.respond(HttpStatusCode.OK, invoice)
    }
  }
  authenticateAdmin {
    post("/auth") {
      val userInfo = call.getCurrentUser()
      if (userInfo != null) {
        val token = tokenService.generateWalletAccessToken(userInfo.userId)
        call.response.cookies.append("walletAccessToken", token, httpOnly = true, path = "/", maxAge = 2 * 60)
        call.respond(HttpStatusCode.OK, mapOf("status" to "ok"))
      } else {
        call.respond(HttpStatusCode.Unauthorized)
      }
    }
    post("/logout") {
      call.response.cookies.append("walletAccessToken", "", maxAge = 0)
      call.respond(HttpStatusCode.OK, mapOf("status" to "ok"))
    }
    authenticateWallet {
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
      post("/payinvoice") {
        val request = call.receive<PayInvoiceRequest>()
        val result = phoenixService.payInvoice(request)
        call.respond(HttpStatusCode.OK, result)
      }
      post("/payoffer") {
        val request = call.receive<PayOfferRequest>()
        val result = phoenixService.payOffer(request)
        call.respond(HttpStatusCode.OK, result)
      }
      post("/payonchain") {
        val request = call.receive<PayOnchainRequest>()
        val result = phoenixService.payOnchain(request)
        call.respond(HttpStatusCode.OK, result)
      }
      post("/bumpfee") {
        val feerateSatByte = call.receive<Int>()
        val result = phoenixService.bumpOnchainFees(feerateSatByte)
        call.respond(HttpStatusCode.OK, result)
      }

      // Payments endpoints
      route("/payments") {
        // List incoming payments
        get("/incoming") {
          val from = call.request.queryParameters["from"]?.toLongOrNull() ?: 0L
          val to = call.request.queryParameters["to"]?.toLongOrNull()
          val limit = call.request.queryParameters["limit"]?.toIntOrNull() ?: 20
          val offset = call.request.queryParameters["offset"]?.toIntOrNull() ?: 0
          val all = call.request.queryParameters["all"]?.toBoolean() ?: false
          val externalId = call.request.queryParameters["externalId"]

          val payments = phoenixService.listIncomingPayments(from, to, limit, offset, all, externalId)
          call.respond(HttpStatusCode.OK, payments)
        }

        // Get specific incoming payment
        get("/incoming/{paymentHash}") {
          val paymentHash =
            call.parameters["paymentHash"] ?: return@get call.respond(HttpStatusCode.BadRequest, "Missing paymentHash")
          val payment = phoenixService.getIncomingPayment(paymentHash)
          call.respond(HttpStatusCode.OK, payment)
        }

        // List outgoing payments
        get("/outgoing") {
          val from = call.request.queryParameters["from"]?.toLongOrNull() ?: 0L
          val to = call.request.queryParameters["to"]?.toLongOrNull()
          val limit = call.request.queryParameters["limit"]?.toIntOrNull() ?: 20
          val offset = call.request.queryParameters["offset"]?.toIntOrNull() ?: 0
          val all = call.request.queryParameters["all"]?.toBoolean() ?: false

          val payments = phoenixService.listOutgoingPayments(from, to, limit, offset, all)
          call.respond(HttpStatusCode.OK, payments)
        }

        // Get specific outgoing payment by ID
        get("/outgoing/{paymentId}") {
          val paymentId =
            call.parameters["paymentId"] ?: return@get call.respond(HttpStatusCode.BadRequest, "Missing paymentId")
          val payment = phoenixService.getOutgoingPayment(paymentId)
          call.respond(HttpStatusCode.OK, payment)
        }

        // Get specific outgoing payment by hash
        get("/outgoingbyhash/{paymentHash}") {
          val paymentHash =
            call.parameters["paymentHash"] ?: return@get call.respond(HttpStatusCode.BadRequest, "Missing paymentHash")
          val payment = phoenixService.getOutgoingPaymentByHash(paymentHash)
          call.respond(HttpStatusCode.OK, payment)
        }
      }
    }
  }
}