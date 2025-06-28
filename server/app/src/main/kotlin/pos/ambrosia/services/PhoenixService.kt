package pos.ambrosia.services

import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import pos.ambrosia.models.Phoenix.*

/**
 * Service for interacting with Phoenix Lightning node
 */
class PhoenixService(
    private val phoenixUrl: String = "http://localhost:9740"
) {
    private val httpClient = HttpClient(CIO) {
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
    suspend fun getNodeInfo(): NodeInfo? {
        return try {
            val response: HttpResponse = httpClient.get("$phoenixUrl/getinfo")
            if (response.status.value == 200) {
                val responseText = response.bodyAsText()
                Json.decodeFromString<NodeInfo>(responseText)
            } else {
                null
            }
        } catch (e: Exception) {
            println("Error getting node info: ${e.message}")
            null
        }
    }

    /**
     * Get balance information from Phoenix
     */
    suspend fun getBalance(): PhoenixBalance? {
        return try {
            val response: HttpResponse = httpClient.get("$phoenixUrl/getbalance")
            if (response.status.value == 200) {
                val responseText = response.bodyAsText()
                Json.decodeFromString<PhoenixBalance>(responseText)
            } else {
                null
            }
        } catch (e: Exception) {
            println("Error getting balance: ${e.message}")
            null
        }
    }


    /**
     * Close the HTTP client when service is no longer needed
     */
    fun close() {
        httpClient.close()
    }
}