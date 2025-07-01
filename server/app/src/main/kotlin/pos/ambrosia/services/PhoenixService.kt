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
    suspend fun createInvoice(request: CreateInvoiceRequest): InvoiceResponse {
        try {
            logger.info(request.toString())
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
            return Json.decodeFromString<InvoiceResponse>(responseText)
        } catch (e: Exception) {
            throw PhoenixServiceException("Failed to create invoice on Phoenix: ${e.message}")
        }
    }
    /**
     * Create a new Bolt12 offer on Phoenix
     */
    
}