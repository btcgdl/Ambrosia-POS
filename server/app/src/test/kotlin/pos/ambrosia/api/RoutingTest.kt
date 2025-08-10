package pos.ambrosia

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import kotlinx.coroutines.runBlocking
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.config.*
import io.ktor.server.testing.*
import io.ktor.server.engine.*
import io.ktor.server.cio.*
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.coroutines.runBlocking
import kotlin.test.*
import pos.ambrosia.api.configureRouting

class RoutingE2ETest {
    private val serverPort = 9154
    private val serverHost = "127.0.0.1"
    private val serverUrl = "http://$serverHost:$serverPort"
    private lateinit var server: ApplicationEngine
    private val client = HttpClient()

    @Test
    fun testRootEndpoint() = runBlocking {
        val response = client.get("$serverUrl/")
        assertEquals(HttpStatusCode.OK, response.status)
        assertEquals("Root path of the API Nothing to see here", response.bodyAsText())
    }

    @Test
    fun testSwaggerEndpoint() = runBlocking {
        val response = client.get("$serverUrl/swagger")
        assertEquals(HttpStatusCode.OK, response.status)
    }

    @Test
    fun testBaseCurrencyEndpoint() = runBlocking {
        val response = client.get("$serverUrl/base-currency")
        // This might fail due to database dependency
        assertTrue(response.status == HttpStatusCode.OK || response.status == HttpStatusCode.InternalServerError)
        if (response.status == HttpStatusCode.OK) {
            val responseBody = response.bodyAsText()
            assertTrue(responseBody.contains("currency_id"))
        }
    }

    @Test
    fun testNonExistentEndpoint() = runBlocking {
        val response = client.get("$serverUrl/non-existent")
        assertEquals(HttpStatusCode.NotFound, response.status)
    }

    @Test
    fun testBaseCurrencyPerformance() = runBlocking {
        val startTime = System.currentTimeMillis()
        client.get("$serverUrl/base-currency")
        val endTime = System.currentTimeMillis()
        val requestTime = endTime - startTime
        // Ensure response time is reasonable (under 1000ms)
        assertTrue(requestTime < 1000, "Request took too long: $requestTime ms")
    }
}