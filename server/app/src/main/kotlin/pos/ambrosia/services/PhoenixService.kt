package pos.ambrosia.services

import io.ktor.http.*
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.client.plugins.auth.*
import io.ktor.client.plugins.auth.providers.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import pos.ambrosia.models.Phoenix.*
import pos.ambrosia.utils.*
import pos.ambrosia.logger
import io.ktor.client.request.forms.submitForm
import pos.ambrosia.config.AppConfig

/**
 * Service for interacting with Phoenix Lightning node
 */
class PhoenixService(
    private val phoenixUrl: String = "http://localhost:9740"
) {
    private val httpClient = HttpClient(CIO) {
        install(Auth) {
            basic {
                credentials {
                    BasicAuthCredentials(username = "", password = AppConfig.getPhoenixProperty("http-password") ?: "")
                }
            }
        }
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
                prettyPrint = true
            })
        }
    }

    /**
     * Get node information from Phoenix
     */
    suspend fun getNodeInfo(): NodeInfo {
        try {
            val response: HttpResponse = httpClient.get("$phoenixUrl/getinfo")
            if (response.status.value != 200) {
                throw PhoenixNodeInfoException("Phoenix node returned status code: ${response.status.value}")
            }
            
            val responseText = response.bodyAsText()
            return Json.decodeFromString<NodeInfo>(responseText)
        } catch (e: PhoenixNodeInfoException) {
            throw e
        } catch (e: Exception) {
            throw PhoenixConnectionException("Failed to connect to Phoenix node: ${e.message}")
        }
    }

    /**
     * Get balance information from Phoenix
     */
    suspend fun getBalance(): PhoenixBalance {
        try {
            val response: HttpResponse = httpClient.get("$phoenixUrl/getbalance")
            if (response.status.value != 200) {
                throw PhoenixBalanceException("Phoenix node returned status code: ${response.status.value}")
            }
            
            val responseText = response.bodyAsText()
            return Json.decodeFromString<PhoenixBalance>(responseText)
        } catch (e: PhoenixBalanceException) {
            throw e
        } catch (e: Exception) {
            throw PhoenixConnectionException("Failed to connect to Phoenix node: ${e.message}")
        }
    }

    /**
     * Create a new Bolt11 invoice on Phoenix
     */
    suspend fun createInvoice(request: CreateInvoiceRequest): CreateInvoiceResponse {
        try {
            val response: HttpResponse = httpClient.submitForm(
                url = "$phoenixUrl/createinvoice",
                formParameters = Parameters.build {
                    append("description", request.description)
                    request.amountSat?.let { append("amountSat", it.toString()) }
                    request.externalId?.let { append("externalId", it) }
                    request.expirySeconds?.let { append("expirySeconds", it.toString()) }
                }
            )
            if (response.status.value != 200) {
                throw PhoenixServiceException("Phoenix node returned ${response.status.value}")
            }
            
            val responseText = response.bodyAsText()
            return Json.decodeFromString<CreateInvoiceResponse>(responseText)
        } catch (e: Exception) {
            throw PhoenixServiceException("Failed to create invoice on Phoenix: ${e.message}")
        }
    }
    
    /**
     * Create a new Bolt12 offer on Phoenix
     */
    suspend fun createOffer(request: CreateOffer): String {
        try {
            val response: HttpResponse = httpClient.submitForm(
                url = "$phoenixUrl/createoffer",
                formParameters = Parameters.build {
                    request.description?.let { append("description", it) }
                    request.amountSat?.let { append("amountSat", it.toString()) }
                }
            )
            if (response.status.value != 200) {
                throw PhoenixServiceException("Phoenix node returned ${response.status.value}")
            }
            
            return response.bodyAsText()
        } catch (e: Exception) {
            throw PhoenixServiceException("Failed to create offer on Phoenix: ${e.message}")
        }
    }

    /**
     * Pay a Bolt11 invoice on Phoenix
     */
    suspend fun payInvoice(request: PayInvoiceRequest): PaymentResponse
    {
        try {
            val response: HttpResponse = httpClient.submitForm(
                url = "$phoenixUrl/payinvoice",
                formParameters = Parameters.build {
                    append("invoice", request.invoice)
                    request.amountSat?.let { append("amountSat", it.toString()) }
                }
            ) 
            if (response.status.value != 200) {
                throw PhoenixServiceException("Phoenix node returned ${response.status.value}")
            }
            val responseText = response.bodyAsText()
            return Json.decodeFromString<PaymentResponse>(responseText)
        
        } catch (e: Exception) {
            throw PhoenixServiceException("Failed to pay invoice on Phoenix: ${e.message}")
        }
    }

    /**
     * Pay a Bolt12 offer on Phoenix
     */
    suspend fun payOffer(request: PayOfferRequest): PaymentResponse {
        try {
            val response: HttpResponse = httpClient.submitForm(
                url = "$phoenixUrl/payoffer",
                formParameters = Parameters.build {
                    append("offer", request.offer)
                    request.amountSat?.let { append("amountSat", it.toString()) }
                    request.message?.let { append("message", it) }
                }
            )
            if (response.status.value != 200) {
                throw PhoenixServiceException("Phoenix node returned ${response.status.value}")
            }
            val responseText = response.bodyAsText()
            return Json.decodeFromString<PaymentResponse>(responseText)
        
        } catch (e: Exception) {
            throw PhoenixServiceException("Failed to pay offer on Phoenix: ${e.message}")
        }
    }

    /**
     * Pay Onchain transaction on Phoenix
     */
    suspend fun payOnchain(request: PayOnchainRequest): PaymentResponse {
        try {
            val response: HttpResponse = httpClient.submitForm(
                url = "$phoenixUrl/payonchain",
                formParameters = Parameters.build {
                    append("address", request.address)
                    append("amountSat", request.amountSat.toString())
                    append("feerateSatByte", request.feerateSatByte.toString())
                }
            )
            if (response.status.value != 200) {
                throw PhoenixServiceException("Phoenix node returned ${response.status.value}")
            }
            val responseText = response.bodyAsText()
            return Json.decodeFromString<PaymentResponse>(responseText)
        
        } catch (e: Exception) {
            throw PhoenixServiceException("Failed to pay onchain transaction on Phoenix: ${e.message}")
        }
    }

    /**
     * Bump the fee of all pending onchain transactions
     */
    suspend fun bumpOnchainFees(feerateSatByte: Int): String {
        try {
            val response: HttpResponse = httpClient.submitForm(
                url ="$phoenixUrl/bumpfee",
                formParameters = Parameters.build {
                    append("feerateSatByte", feerateSatByte.toString())
                }
            )
            if (response.status.value != 200) {
                throw PhoenixServiceException("Phoenix node returned ${response.status.value}")
            }
            
            return response.bodyAsText()

        } catch (e: Exception) {
            throw PhoenixServiceException("Failed to bump onchain fees on Phoenix: ${e.message}")
        }
    }

    /**
     * List incoming payments from Phoenix
     */
    suspend fun listIncomingPayments(
        from: Long = 0,
        to: Long? = null,
        limit: Int = 20,
        offset: Int = 0,
        all: Boolean = false,
        externalId: String? = null
    ): List<IncomingPayment> {
        try {
            val response: HttpResponse = httpClient.get("$phoenixUrl/payments/incoming") {
                parameter("from", from)
                to?.let { parameter("to", it) }
                parameter("limit", limit)
                parameter("offset", offset)
                if (all) parameter("all", "true")
                externalId?.let { parameter("externalId", it) }
            }
            if (response.status.value != 200) {
                throw PhoenixServiceException("Phoenix node returned ${response.status.value}")
            }
            
            val responseText = response.bodyAsText()
            return Json.decodeFromString<List<IncomingPayment>>(responseText)
        } catch (e: Exception) {
            throw PhoenixServiceException("Failed to list incoming payments on Phoenix: ${e.message}")
        }
    }

    /**
     * Get a specific incoming payment by payment hash
     */
    suspend fun getIncomingPayment(paymentHash: String): IncomingPayment {
        try {
            val response: HttpResponse = httpClient.get("$phoenixUrl/payments/incoming/$paymentHash")
            if (response.status.value != 200) {
                throw PhoenixServiceException("Phoenix node returned ${response.status.value}")
            }
            
            val responseText = response.bodyAsText()
            return Json.decodeFromString<IncomingPayment>(responseText)
        } catch (e: Exception) {
            throw PhoenixServiceException("Failed to get incoming payment on Phoenix: ${e.message}")
        }
    }

    /**
     * List outgoing payments from Phoenix
     */
    suspend fun listOutgoingPayments(
        from: Long = 0,
        to: Long? = null,
        limit: Int = 20,
        offset: Int = 0,
        all: Boolean = false
    ): List<OutgoingPayment> {
        try {
            val response: HttpResponse = httpClient.get("$phoenixUrl/payments/outgoing") {
                parameter("from", from)
                to?.let { parameter("to", it) }
                parameter("limit", limit)
                parameter("offset", offset)
                if (all) parameter("all", "true")
            }
            if (response.status.value != 200) {
                throw PhoenixServiceException("Phoenix node returned ${response.status.value}")
            }
            
            val responseText = response.bodyAsText()
            return Json.decodeFromString<List<OutgoingPayment>>(responseText)
        } catch (e: Exception) {
            throw PhoenixServiceException("Failed to list outgoing payments on Phoenix: ${e.message}")
        }
    }

    /**
     * Get a specific outgoing payment by payment ID
     */
    suspend fun getOutgoingPayment(paymentId: String): OutgoingPayment {
        try {
            val response: HttpResponse = httpClient.get("$phoenixUrl/payments/outgoing/$paymentId")
            if (response.status.value != 200) {
                throw PhoenixServiceException("Phoenix node returned ${response.status.value}")
            }
            
            val responseText = response.bodyAsText()
            return Json.decodeFromString<OutgoingPayment>(responseText)
        } catch (e: Exception) {
            throw PhoenixServiceException("Failed to get outgoing payment on Phoenix: ${e.message}")
        }
    }

    /**
     * Get a specific outgoing payment by payment hash
     */
    suspend fun getOutgoingPaymentByHash(paymentHash: String): OutgoingPayment {
        try {
            val response: HttpResponse = httpClient.get("$phoenixUrl/payments/outgoingbyhash/$paymentHash")
            if (response.status.value != 200) {
                throw PhoenixServiceException("Phoenix node returned ${response.status.value}")
            }
            
            val responseText = response.bodyAsText()
            return Json.decodeFromString<OutgoingPayment>(responseText)
        } catch (e: Exception) {
            throw PhoenixServiceException("Failed to get outgoing payment by hash on Phoenix: ${e.message}")
        }
    }
}