package pos.ambrosia.utest

import io.ktor.client.* 
import io.ktor.client.engine.mock.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.config.*
import io.ktor.utils.io.*
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import org.mockito.kotlin.*
import pos.ambrosia.models.Phoenix.NodeInfo
import pos.ambrosia.services.PhoenixService
import java.io.IOException
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

class PhoenixServiceTest {

    private val mockConfig: ApplicationConfig = mock()
    private val mockEnv: ApplicationEnvironment = mock {
        on { config } doReturn mockConfig
    }

    @Test
    fun `getNodeInfo returns NodeInfo on success`() {
        // Arrange: Define the successful JSON response
        val mockJsonResponse = """
            {
                "nodeId": "02f3c93f2bsd...",
                "channels": [],
                "chain": "mainnet",
                "blockHeight": 800000,
                "version": "v0.1.0"
            }
        """.trimIndent()

        // Arrange: Create a MockEngine to deliver the successful response
        val mockEngine = MockEngine { request ->
            respond(
                content = ByteReadChannel(mockJsonResponse.toByteArray(Charsets.UTF_8)),
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, "application/json")
            )
        }

        // Arrange: Create an HttpClient that uses our MockEngine and can handle JSON
        val mockHttpClient = HttpClient(mockEngine) {
            install(ContentNegotiation) {
                json(Json { ignoreUnknownKeys = true })
            }
        }

        // Arrange: Mock the environment configuration (still needed for the constructor)
        val mockUrlValue: ApplicationConfigValue = mock()
        whenever(mockUrlValue.getString()).thenReturn("http://dummy-url")
        whenever(mockConfig.property("phoenixd-url")).thenReturn(mockUrlValue)

        val mockPasswordValue: ApplicationConfigValue = mock()
        whenever(mockPasswordValue.getString()).thenReturn("dummy-password")
        whenever(mockConfig.property("phoenixd-password")).thenReturn(mockPasswordValue)

        // Act: Create the service using the NEW constructor, injecting the mock client
        val phoenixService = PhoenixService(mockEnv, mockHttpClient)
        val nodeInfo = runBlocking { phoenixService.getNodeInfo() }

        // Assert: Verify the data was parsed correctly
        assertEquals("mainnet", nodeInfo.chain)
        assertEquals(800000, nodeInfo.blockHeight)
        assertEquals("v0.1.0", nodeInfo.version)
    }

    @Test
    fun `getNodeInfo throws PhoenixNodeInfoException on non-200 response`() {
        // Arrange: Configure the MockEngine to return a server error
        val mockEngine = MockEngine { request ->
            respond(
                content = ByteReadChannel(""),
                status = HttpStatusCode.InternalServerError
            )
        }
        val mockHttpClient = HttpClient(mockEngine)

        // Arrange: Mock the environment configuration
        val mockUrlValue: ApplicationConfigValue = mock()
        whenever(mockUrlValue.getString()).thenReturn("http://dummy-url")
        whenever(mockConfig.property("phoenixd-url")).thenReturn(mockUrlValue)
        val mockPasswordValue: ApplicationConfigValue = mock()
        whenever(mockPasswordValue.getString()).thenReturn("dummy-password")
        whenever(mockConfig.property("phoenixd-password")).thenReturn(mockPasswordValue)

        val phoenixService = PhoenixService(mockEnv, mockHttpClient)

        // Act & Assert: Expect a PhoenixNodeInfoException
        assertFailsWith<pos.ambrosia.utils.PhoenixNodeInfoException> {
            runBlocking { phoenixService.getNodeInfo() }
        }
    }

    @Test
    fun `getNodeInfo throws PhoenixConnectionException on network error`() {
        // Arrange: Configure the MockEngine to throw a network error
        val mockEngine = MockEngine { request ->
            throw IOException("Network error")
        }
        val mockHttpClient = HttpClient(mockEngine)

        // Arrange: Mock the environment configuration
        val mockUrlValue: ApplicationConfigValue = mock()
        whenever(mockUrlValue.getString()).thenReturn("http://dummy-url")
        whenever(mockConfig.property("phoenixd-url")).thenReturn(mockUrlValue)
        val mockPasswordValue: ApplicationConfigValue = mock()
        whenever(mockPasswordValue.getString()).thenReturn("dummy-password")
        whenever(mockConfig.property("phoenixd-password")).thenReturn(mockPasswordValue)

        val phoenixService = PhoenixService(mockEnv, mockHttpClient)

        // Act & Assert: Expect a PhoenixConnectionException
        assertFailsWith<pos.ambrosia.utils.PhoenixConnectionException> {
            runBlocking { phoenixService.getNodeInfo() }
        }
    }

    @Test
    fun `getBalance returns PhoenixBalance on success`() {
        // Arrange
        val mockJsonResponse = """
            {
                "balanceSat": 100000,
                "feeCreditSat": 1000
            }
        """.trimIndent()
        val mockEngine = MockEngine { request ->
            respond(
                content = ByteReadChannel(mockJsonResponse.toByteArray(Charsets.UTF_8)),
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, "application/json")
            )
        }
        val mockHttpClient = HttpClient(mockEngine) {
            install(ContentNegotiation) {
                json(Json { ignoreUnknownKeys = true })
            }
        }
        val mockUrlValue: ApplicationConfigValue = mock()
        whenever(mockUrlValue.getString()).thenReturn("http://dummy-url")
        whenever(mockConfig.property("phoenixd-url")).thenReturn(mockUrlValue)
        val mockPasswordValue: ApplicationConfigValue = mock()
        whenever(mockPasswordValue.getString()).thenReturn("dummy-password")
        whenever(mockConfig.property("phoenixd-password")).thenReturn(mockPasswordValue)

        val phoenixService = PhoenixService(mockEnv, mockHttpClient)

        // Act
        val balance = runBlocking { phoenixService.getBalance() }

        // Assert
        assertEquals(100000, balance.balanceSat)
    }

    @Test
    fun `getBalance throws PhoenixBalanceException on non-200 response`() {
        // Arrange
        val mockEngine = MockEngine { request ->
            respond(
                content = ByteReadChannel(""),
                status = HttpStatusCode.InternalServerError
            )
        }
        val mockHttpClient = HttpClient(mockEngine)
        val mockUrlValue: ApplicationConfigValue = mock()
        whenever(mockUrlValue.getString()).thenReturn("http://dummy-url")
        whenever(mockConfig.property("phoenixd-url")).thenReturn(mockUrlValue)
        val mockPasswordValue: ApplicationConfigValue = mock()
        whenever(mockPasswordValue.getString()).thenReturn("dummy-password")
        whenever(mockConfig.property("phoenixd-password")).thenReturn(mockPasswordValue)

        val phoenixService = PhoenixService(mockEnv, mockHttpClient)

        // Act & Assert
        assertFailsWith<pos.ambrosia.utils.PhoenixBalanceException> {
            runBlocking { phoenixService.getBalance() }
        }
    }

    @Test
    fun `getBalance throws PhoenixConnectionException on network error`() {
        // Arrange
        val mockEngine = MockEngine { request ->
            throw IOException("Network error")
        }
        val mockHttpClient = HttpClient(mockEngine)
        val mockUrlValue: ApplicationConfigValue = mock()
        whenever(mockUrlValue.getString()).thenReturn("http://dummy-url")
        whenever(mockConfig.property("phoenixd-url")).thenReturn(mockUrlValue)
        val mockPasswordValue: ApplicationConfigValue = mock()
        whenever(mockPasswordValue.getString()).thenReturn("dummy-password")
        whenever(mockConfig.property("phoenixd-password")).thenReturn(mockPasswordValue)

        val phoenixService = PhoenixService(mockEnv, mockHttpClient)

        // Act & Assert
        assertFailsWith<pos.ambrosia.utils.PhoenixConnectionException> {
            runBlocking { phoenixService.getBalance() }
        }
    }

    @Test
    fun `createInvoice returns CreateInvoiceResponse on success`() {
        // Arrange
        val mockJsonResponse = """
            {
                "amountSat": 1000,
                "paymentHash": "hash",
                "serialized": "lnbc10..."
            }
        """.trimIndent()
        val mockEngine = MockEngine { request ->
            respond(
                content = ByteReadChannel(mockJsonResponse.toByteArray(Charsets.UTF_8)),
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, "application/json")
            )
        }
        val mockHttpClient = HttpClient(mockEngine) {
            install(ContentNegotiation) {
                json(Json { ignoreUnknownKeys = true })
            }
        }
        val mockUrlValue: ApplicationConfigValue = mock()
        whenever(mockUrlValue.getString()).thenReturn("http://dummy-url")
        whenever(mockConfig.property("phoenixd-url")).thenReturn(mockUrlValue)
        val mockPasswordValue: ApplicationConfigValue = mock()
        whenever(mockPasswordValue.getString()).thenReturn("dummy-password")
        whenever(mockConfig.property("phoenixd-password")).thenReturn(mockPasswordValue)

        val phoenixService = PhoenixService(mockEnv, mockHttpClient)

        // Act
        val request = pos.ambrosia.models.Phoenix.CreateInvoiceRequest(description = "test")
        val invoiceResponse = runBlocking { phoenixService.createInvoice(request) }

        // Assert
        assertEquals(1000, invoiceResponse.amountSat)
        assertEquals("hash", invoiceResponse.paymentHash)
    }

    @Test
    fun `createInvoice throws PhoenixServiceException on non-200 response`() {
        // Arrange
        val mockEngine = MockEngine { request ->
            respond(
                content = ByteReadChannel(""),
                status = HttpStatusCode.InternalServerError
            )
        }
        val mockHttpClient = HttpClient(mockEngine)
        val mockUrlValue: ApplicationConfigValue = mock()
        whenever(mockUrlValue.getString()).thenReturn("http://dummy-url")
        whenever(mockConfig.property("phoenixd-url")).thenReturn(mockUrlValue)
        val mockPasswordValue: ApplicationConfigValue = mock()
        whenever(mockPasswordValue.getString()).thenReturn("dummy-password")
        whenever(mockConfig.property("phoenixd-password")).thenReturn(mockPasswordValue)

        val phoenixService = PhoenixService(mockEnv, mockHttpClient)

        // Act & Assert
        val request = pos.ambrosia.models.Phoenix.CreateInvoiceRequest(description = "test")
        assertFailsWith<pos.ambrosia.utils.PhoenixServiceException> {
            runBlocking { phoenixService.createInvoice(request) }
        }
    }

    @Test
    fun `createInvoice throws PhoenixConnectionException on network error`() {
        // Arrange
        val mockEngine = MockEngine { request ->
            throw IOException("Network error")
        }
        val mockHttpClient = HttpClient(mockEngine)
        val mockUrlValue: ApplicationConfigValue = mock()
        whenever(mockUrlValue.getString()).thenReturn("http://dummy-url")
        whenever(mockConfig.property("phoenixd-url")).thenReturn(mockUrlValue)
        val mockPasswordValue: ApplicationConfigValue = mock()
        whenever(mockPasswordValue.getString()).thenReturn("dummy-password")
        whenever(mockConfig.property("phoenixd-password")).thenReturn(mockPasswordValue)

        val phoenixService = PhoenixService(mockEnv, mockHttpClient)

        // Act & Assert
        val request = pos.ambrosia.models.Phoenix.CreateInvoiceRequest(description = "test")
        assertFailsWith<pos.ambrosia.utils.PhoenixServiceException> {
            runBlocking { phoenixService.createInvoice(request) }
        }
    }

    @Test
    fun `createOffer returns String on success`() {
        // Arrange
        val mockStringResponse = "lno1234567890"

        val mockEngine = MockEngine { request ->
            respond(
                content = mockStringResponse,
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, "text/plain")
            )
        }
        val mockHttpClient = HttpClient(mockEngine)
        val mockUrlValue: ApplicationConfigValue = mock()
        whenever(mockUrlValue.getString()).thenReturn("http://dummy-url")
        whenever(mockConfig.property("phoenixd-url")).thenReturn(mockUrlValue)
        val mockPasswordValue: ApplicationConfigValue = mock()
        whenever(mockPasswordValue.getString()).thenReturn("dummy-password")
        whenever(mockConfig.property("phoenixd-password")).thenReturn(mockPasswordValue)

        val phoenixService = PhoenixService(mockEnv, mockHttpClient)

        // Act
        val request = pos.ambrosia.models.Phoenix.CreateOffer(description = "test")
        val offerResponse = runBlocking { phoenixService.createOffer(request) }

        // Assert
        assertEquals("lno1234567890", offerResponse)
    }

    @Test
    fun `createOffer throws PhoenixServiceException on non-200 response`() {
        // Arrange
        val mockEngine = MockEngine { request ->
            respond(
                content = ByteReadChannel(""),
                status = HttpStatusCode.InternalServerError
            )
        }
        val mockHttpClient = HttpClient(mockEngine)
        val mockUrlValue: ApplicationConfigValue = mock()
        whenever(mockUrlValue.getString()).thenReturn("http://dummy-url")
        whenever(mockConfig.property("phoenixd-url")).thenReturn(mockUrlValue)
        val mockPasswordValue: ApplicationConfigValue = mock()
        whenever(mockPasswordValue.getString()).thenReturn("dummy-password")
        whenever(mockConfig.property("phoenixd-password")).thenReturn(mockPasswordValue)

        val phoenixService = PhoenixService(mockEnv, mockHttpClient)

        // Act & Assert
        val request = pos.ambrosia.models.Phoenix.CreateOffer(description = "test")
        assertFailsWith<pos.ambrosia.utils.PhoenixServiceException> {
            runBlocking { phoenixService.createOffer(request) }
        }
    }

    @Test
    fun `createOffer throws PhoenixConnectionException on network error`() {
        // Arrange
        val mockEngine = MockEngine { request ->
            throw IOException("Network error")
        }
        val mockHttpClient = HttpClient(mockEngine)
        val mockUrlValue: ApplicationConfigValue = mock()
        whenever(mockUrlValue.getString()).thenReturn("http://dummy-url")
        whenever(mockConfig.property("phoenixd-url")).thenReturn(mockUrlValue)
        val mockPasswordValue: ApplicationConfigValue = mock()
        whenever(mockPasswordValue.getString()).thenReturn("dummy-password")
        whenever(mockConfig.property("phoenixd-password")).thenReturn(mockPasswordValue)

        val phoenixService = PhoenixService(mockEnv, mockHttpClient)

        // Act & Assert
        val request = pos.ambrosia.models.Phoenix.CreateOffer(description = "test")
        assertFailsWith<pos.ambrosia.utils.PhoenixServiceException> {
            runBlocking { phoenixService.createOffer(request) }
        }
    }





    

}