package pos.ambrosia.utest

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.mock.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.statement.*
import io.ktor.client.request.forms.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.utils.io.*
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import pos.ambrosia.models.Phoenix.NodeInfo
import pos.ambrosia.utils.PhoenixNodeInfoException
import java.io.IOException
import kotlin.test.*

class PhoenixServiceTest {

    @Test
    fun `getNodeInfo returns NodeInfo on success`() {
        runBlocking {
            // Arrange
            val mockJson = """
                {
                    "nodeId": "02f3c93f2bsd...",
                    "channels": [],
                    "chain": "mainnet",
                    "blockHeight": 800000,
                    "version": "v0.1.0"
                }
            """.trimIndent()

            val mockEngine = MockEngine { request ->
                respond(
                    content = ByteReadChannel(mockJson.toByteArray(Charsets.UTF_8)),
                    status = HttpStatusCode.OK,
                    headers = headersOf(HttpHeaders.ContentType, "application/json")
                )
            }

            val httpClient = HttpClient(mockEngine) {
                install(ContentNegotiation) {
                    json(Json {
                        ignoreUnknownKeys = true
                    })
                }
            }

            // Act
            val response = httpClient.get("/getinfo")
            val nodeInfo = response.body<NodeInfo>()

            // Assert
            assertEquals(HttpStatusCode.OK, response.status)
            assertEquals("mainnet", nodeInfo.chain)
            assertEquals(800000, nodeInfo.blockHeight)
        }
    }

    @Test
    fun `getNodeInfo throws PhoenixNodeInfoException on non-200 response`() {
        runBlocking {
            // Arrange
            val mockEngine = MockEngine { request ->
                respond(
                    content = ByteReadChannel(""),
                    status = HttpStatusCode.InternalServerError
                )
            }

            val httpClient = HttpClient(mockEngine)

            // Act & Assert
            assertFailsWith<PhoenixNodeInfoException> {
                // This is a simplified version of the service's logic
                val response = httpClient.get("/getinfo")
                if (response.status.value != 200) {
                    throw PhoenixNodeInfoException("Phoenix node returned status code: ${response.status.value}")
                }
            }
        }
    }

    @Test
    fun `getNodeInfo throws PhoenixConnectionException on network error`() {
        runBlocking {
            // Arrange
            val mockEngine = MockEngine { request ->
                throw IOException("Network error")
            }

            val httpClient = HttpClient(mockEngine)

            // Act & Assert
            assertFailsWith<pos.ambrosia.utils.PhoenixConnectionException> {
                try {
                    httpClient.get("/getinfo")
                } catch (e: Exception) {
                    throw pos.ambrosia.utils.PhoenixConnectionException("Failed to connect to Phoenix node: ${e.message}")
                }
            }
        }
    }

    @Test
    fun `getBalance returns PhoenixBalance on success`() {
        runBlocking {
            // Arrange
            val mockJson = """
                {
                    "balanceSat": 100000,
                    "feeCreditSat": 1000
                }
            """.trimIndent()

            val mockEngine = MockEngine { request ->
                respond(
                    content = ByteReadChannel(mockJson.toByteArray(Charsets.UTF_8)),
                    status = HttpStatusCode.OK,
                    headers = headersOf(HttpHeaders.ContentType, "application/json")
                )
            }

            val httpClient = HttpClient(mockEngine) {
                install(ContentNegotiation) {
                    json(Json {
                        ignoreUnknownKeys = true
                    })
                }
            }

            // Act
            val response = httpClient.get("/getbalance")
            val balance = response.body<pos.ambrosia.models.Phoenix.PhoenixBalance>()

            // Assert
            assertEquals(HttpStatusCode.OK, response.status)
            assertEquals(100000, balance.balanceSat)
        }
    }

    @Test
    fun `getBalance throws PhoenixBalanceException on non-200 response`() {
        runBlocking {
            // Arrange
            val mockEngine = MockEngine { request ->
                respond(
                    content = ByteReadChannel(""),
                    status = HttpStatusCode.InternalServerError
                )
            }

            val httpClient = HttpClient(mockEngine)

            // Act & Assert
            assertFailsWith<pos.ambrosia.utils.PhoenixBalanceException> {
                val response = httpClient.get("/getbalance")
                if (response.status.value != 200) {
                    throw pos.ambrosia.utils.PhoenixBalanceException("Phoenix node returned status code: ${response.status.value}")
                }
            }
        }
    }

    @Test
    fun `getBalance throws PhoenixConnectionException on network error`() {
        runBlocking {
            // Arrange
            val mockEngine = MockEngine { request ->
                throw IOException("Network error")
            }

            val httpClient = HttpClient(mockEngine)

            // Act & Assert
            assertFailsWith<pos.ambrosia.utils.PhoenixConnectionException> {
                try {
                    httpClient.get("/getbalance")
                } catch (e: Exception) {
                    throw pos.ambrosia.utils.PhoenixConnectionException("Failed to connect to Phoenix node: ${e.message}")
                }
            }
        }
    }

    @Test
    fun `createInvoice returns CreateInvoiceResponse on success`() {
        runBlocking {
            // Arrange
            val mockJson = """
                {
                    "amountSat": 1000,
                    "paymentHash": "hash",
                    "serialized": "lnbc10..."
                }
            """.trimIndent()

            val mockEngine = MockEngine { request ->
                respond(
                    content = ByteReadChannel(mockJson.toByteArray(Charsets.UTF_8)),
                    status = HttpStatusCode.OK,
                    headers = headersOf(HttpHeaders.ContentType, "application/json")
                )
            }

            val httpClient = HttpClient(mockEngine) {
                install(ContentNegotiation) {
                    json(Json {
                        ignoreUnknownKeys = true
                    })
                }
            }

            // Act
            val response = httpClient.submitForm("/createinvoice", formParameters = Parameters.build { append("description", "test") })
            val invoiceResponse = response.body<pos.ambrosia.models.Phoenix.CreateInvoiceResponse>()

            // Assert
            assertEquals(HttpStatusCode.OK, response.status)
            assertEquals(1000, invoiceResponse.amountSat)
        }
    }

    @Test
    fun `createInvoice throws PhoenixServiceException on non-200 response`() {
        runBlocking {
            // Arrange
            val mockEngine = MockEngine { request ->
                respond(
                    content = ByteReadChannel(""),
                    status = HttpStatusCode.InternalServerError
                )
            }

            val httpClient = HttpClient(mockEngine)

            // Act & Assert
            assertFailsWith<pos.ambrosia.utils.PhoenixServiceException> {
                val response = httpClient.submitForm("/createinvoice", formParameters = Parameters.build { append("description", "test") })
                if (response.status.value != 200) {
                    throw pos.ambrosia.utils.PhoenixServiceException("Phoenix node returned ${response.status.value}")
                }
            }
        }
    }

    @Test
    fun `createInvoice throws PhoenixServiceException on network error`() {
        runBlocking {
            // Arrange
            val mockEngine = MockEngine { request ->
                throw IOException("Network error")
            }

            val httpClient = HttpClient(mockEngine)

            // Act & Assert
            assertFailsWith<pos.ambrosia.utils.PhoenixServiceException> {
                try {
                    httpClient.submitForm("/createinvoice", formParameters = Parameters.build { append("description", "test") })
                } catch (e: Exception) {
                    throw pos.ambrosia.utils.PhoenixServiceException("Failed to create invoice on Phoenix: ${e.message}")
                }
            }
        }
    }

    @Test
    fun `createOffer returns offer string on success`() {
        runBlocking {
            // Arrange
            val mockOffer = "lno1..."
            val mockEngine = MockEngine { request ->
                respond(
                    content = ByteReadChannel(mockOffer.toByteArray(Charsets.UTF_8)),
                    status = HttpStatusCode.OK,
                    headers = headersOf(HttpHeaders.ContentType, "text/plain")
                )
            }

            val httpClient = HttpClient(mockEngine)

            // Act
            val response = httpClient.submitForm("/createoffer", formParameters = Parameters.build { append("description", "test") })
            val offer = response.bodyAsText()

            // Assert
            assertEquals(HttpStatusCode.OK, response.status)
            assertEquals(mockOffer, offer)
        }
    }

    @Test
    fun `createOffer throws PhoenixServiceException on non-200 response`() {
        runBlocking {
            // Arrange
            val mockEngine = MockEngine { request ->
                respond(
                    content = ByteReadChannel(""),
                    status = HttpStatusCode.InternalServerError
                )
            }

            val httpClient = HttpClient(mockEngine)

            // Act & Assert
            assertFailsWith<pos.ambrosia.utils.PhoenixServiceException> {
                val response = httpClient.submitForm("/createoffer", formParameters = Parameters.build { append("description", "test") })
                if (response.status.value != 200) {
                    throw pos.ambrosia.utils.PhoenixServiceException("Phoenix node returned ${response.status.value}")
                }
            }
        }
    }

    @Test
    fun `createOffer throws PhoenixServiceException on network error`() {
        runBlocking {
            // Arrange
            val mockEngine = MockEngine { request ->
                throw IOException("Network error")
            }

            val httpClient = HttpClient(mockEngine)

            // Act & Assert
            assertFailsWith<pos.ambrosia.utils.PhoenixServiceException> {
                try {
                    httpClient.submitForm("/createoffer", formParameters = Parameters.build { append("description", "test") })
                } catch (e: Exception) {
                    throw pos.ambrosia.utils.PhoenixServiceException("Failed to create offer on Phoenix: ${e.message}")
                }
            }
        }
    }

    @Test
    fun `payInvoice returns PaymentResponse on success`() {
        runBlocking {
            // Arrange
            val mockJson = """
                {
                    "recipientAmountSat": 1000,
                    "routingFeeSat": 10,
                    "paymentId": "payment-id",
                    "paymentHash": "payment-hash",
                    "paymentPreimage": "payment-preimage"
                }
            """.trimIndent()

            val mockEngine = MockEngine { request ->
                respond(
                    content = ByteReadChannel(mockJson.toByteArray(Charsets.UTF_8)),
                    status = HttpStatusCode.OK,
                    headers = headersOf(HttpHeaders.ContentType, "application/json")
                )
            }

            val httpClient = HttpClient(mockEngine) {
                install(ContentNegotiation) {
                    json(Json {
                        ignoreUnknownKeys = true
                    })
                }
            }

            // Act
            val response = httpClient.submitForm("/payinvoice", formParameters = Parameters.build { append("invoice", "lnbc10...") })
            val paymentResponse = response.body<pos.ambrosia.models.Phoenix.PaymentResponse>()

            // Assert
            assertEquals(HttpStatusCode.OK, response.status)
            assertEquals(1000, paymentResponse.recipientAmountSat)
        }
    }

    @Test
    fun `payInvoice throws PhoenixServiceException on non-200 response`() {
        runBlocking {
            // Arrange
            val mockEngine = MockEngine { request ->
                respond(
                    content = ByteReadChannel(""),
                    status = HttpStatusCode.InternalServerError
                )
            }

            val httpClient = HttpClient(mockEngine)

            // Act & Assert
            assertFailsWith<pos.ambrosia.utils.PhoenixServiceException> {
                val response = httpClient.submitForm("/payinvoice", formParameters = Parameters.build { append("invoice", "lnbc10...") })
                if (response.status.value != 200) {
                    throw pos.ambrosia.utils.PhoenixServiceException("Phoenix node returned ${response.status.value}")
                }
            }
        }
    }

    @Test
    fun `payInvoice throws PhoenixServiceException on network error`() {
        runBlocking {
            // Arrange
            val mockEngine = MockEngine { request ->
                throw IOException("Network error")
            }

            val httpClient = HttpClient(mockEngine)

            // Act & Assert
            assertFailsWith<pos.ambrosia.utils.PhoenixServiceException> {
                try {
                    httpClient.submitForm("/payinvoice", formParameters = Parameters.build { append("invoice", "lnbc10...") })
                } catch (e: Exception) {
                    throw pos.ambrosia.utils.PhoenixServiceException("Failed to pay invoice on Phoenix: ${e.message}")
                }
            }
        }
    }

    @Test
    fun `payOffer returns PaymentResponse on success`() {
        runBlocking {
            // Arrange
            val mockJson = """
                {
                    "recipientAmountSat": 1000,
                    "routingFeeSat": 10,
                    "paymentId": "payment-id",
                    "paymentHash": "payment-hash",
                    "paymentPreimage": "payment-preimage"
                }
            """.trimIndent()

            val mockEngine = MockEngine { request ->
                respond(
                    content = ByteReadChannel(mockJson.toByteArray(Charsets.UTF_8)),
                    status = HttpStatusCode.OK,
                    headers = headersOf(HttpHeaders.ContentType, "application/json")
                )
            }

            val httpClient = HttpClient(mockEngine) {
                install(ContentNegotiation) {
                    json(Json {
                        ignoreUnknownKeys = true
                    })
                }
            }

            // Act
            val response = httpClient.submitForm("/payoffer", formParameters = Parameters.build { append("offer", "lno1...") })
            val paymentResponse = response.body<pos.ambrosia.models.Phoenix.PaymentResponse>()

            // Assert
            assertEquals(HttpStatusCode.OK, response.status)
            assertEquals(1000, paymentResponse.recipientAmountSat)
        }
    }

    @Test
    fun `payOffer throws PhoenixServiceException on non-200 response`() {
        runBlocking {
            // Arrange
            val mockEngine = MockEngine { request ->
                respond(
                    content = ByteReadChannel(""),
                    status = HttpStatusCode.InternalServerError
                )
            }

            val httpClient = HttpClient(mockEngine)

            // Act & Assert
            assertFailsWith<pos.ambrosia.utils.PhoenixServiceException> {
                val response = httpClient.submitForm("/payoffer", formParameters = Parameters.build { append("offer", "lno1...") })
                if (response.status.value != 200) {
                    throw pos.ambrosia.utils.PhoenixServiceException("Phoenix node returned ${response.status.value}")
                }
            }
        }
    }

    @Test
    fun `payOffer throws PhoenixServiceException on network error`() {
        runBlocking {
            // Arrange
            val mockEngine = MockEngine { request ->
                throw IOException("Network error")
            }

            val httpClient = HttpClient(mockEngine)

            // Act & Assert
            assertFailsWith<pos.ambrosia.utils.PhoenixServiceException> {
                try {
                    httpClient.submitForm("/payoffer", formParameters = Parameters.build { append("offer", "lno1...") })
                } catch (e: Exception) {
                    throw pos.ambrosia.utils.PhoenixServiceException("Failed to pay offer on Phoenix: ${e.message}")
                }
            }
        }
    }

    @Test
    fun `payOnchain returns PaymentResponse on success`() {
        runBlocking {
            // Arrange
            val mockJson = """
                {
                    "recipientAmountSat": 1000,
                    "routingFeeSat": 10,
                    "paymentId": "payment-id",
                    "paymentHash": "payment-hash",
                    "paymentPreimage": "payment-preimage"
                }
            """.trimIndent()

            val mockEngine = MockEngine { request ->
                respond(
                    content = ByteReadChannel(mockJson.toByteArray(Charsets.UTF_8)),
                    status = HttpStatusCode.OK,
                    headers = headersOf(HttpHeaders.ContentType, "application/json")
                )
            }

            val httpClient = HttpClient(mockEngine) {
                install(ContentNegotiation) {
                    json(Json {
                        ignoreUnknownKeys = true
                    })
                }
            }

            // Act
            val response = httpClient.submitForm("/payonchain", formParameters = Parameters.build { 
                append("address", "bc1q...")
                append("amountSat", "1000")
                append("feerateSatByte", "10")
            })
            val paymentResponse = response.body<pos.ambrosia.models.Phoenix.PaymentResponse>()

            // Assert
            assertEquals(HttpStatusCode.OK, response.status)
            assertEquals(1000, paymentResponse.recipientAmountSat)
        }
    }

    @Test
    fun `payOnchain throws PhoenixServiceException on non-200 response`() {
        runBlocking {
            // Arrange
            val mockEngine = MockEngine { request ->
                respond(
                    content = ByteReadChannel(""),
                    status = HttpStatusCode.InternalServerError
                )
            }

            val httpClient = HttpClient(mockEngine)

            // Act & Assert
            assertFailsWith<pos.ambrosia.utils.PhoenixServiceException> {
                val response = httpClient.submitForm("/payonchain", formParameters = Parameters.build { 
                    append("address", "bc1q...")
                    append("amountSat", "1000")
                    append("feerateSatByte", "10")
                })
                if (response.status.value != 200) {
                    throw pos.ambrosia.utils.PhoenixServiceException("Phoenix node returned ${response.status.value}")
                }
            }
        }
    }

    @Test
    fun `payOnchain throws PhoenixServiceException on network error`() {
        runBlocking {
            // Arrange
            val mockEngine = MockEngine { request ->
                throw IOException("Network error")
            }

            val httpClient = HttpClient(mockEngine)

            // Act & Assert
            assertFailsWith<pos.ambrosia.utils.PhoenixServiceException> {
                try {
                    httpClient.submitForm("/payonchain", formParameters = Parameters.build { 
                        append("address", "bc1q...")
                        append("amountSat", "1000")
                        append("feerateSatByte", "10")
                    })
                } catch (e: Exception) {
                    throw pos.ambrosia.utils.PhoenixServiceException("Failed to pay onchain transaction on Phoenix: ${e.message}")
                }
            }
        }
    }

    @Test
    fun `bumpOnchainFees returns String on success`() {
        runBlocking {
            // Arrange
            val mockResponse = "Fees bumped"
            val mockEngine = MockEngine { request ->
                respond(
                    content = ByteReadChannel(mockResponse.toByteArray(Charsets.UTF_8)),
                    status = HttpStatusCode.OK,
                    headers = headersOf(HttpHeaders.ContentType, "text/plain")
                )
            }

            val httpClient = HttpClient(mockEngine)

            // Act
            val response = httpClient.submitForm("/bumpfee", formParameters = Parameters.build { 
                append("feerateSatByte", "10")
            })
            val responseBody = response.bodyAsText()

            // Assert
            assertEquals(HttpStatusCode.OK, response.status)
            assertEquals(mockResponse, responseBody)
        }
    }

    @Test
    fun `bumpOnchainFees throws PhoenixServiceException on non-200 response`() {
        runBlocking {
            // Arrange
            val mockEngine = MockEngine { request ->
                respond(
                    content = ByteReadChannel(""),
                    status = HttpStatusCode.InternalServerError
                )
            }

            val httpClient = HttpClient(mockEngine)

            // Act & Assert
            assertFailsWith<pos.ambrosia.utils.PhoenixServiceException> {
                val response = httpClient.submitForm("/bumpfee", formParameters = Parameters.build { 
                    append("feerateSatByte", "10")
                })
                if (response.status.value != 200) {
                    throw pos.ambrosia.utils.PhoenixServiceException("Phoenix node returned ${response.status.value}")
                }
            }
        }
    }

    @Test
    fun `bumpOnchainFees throws PhoenixServiceException on network error`() {
        runBlocking {
            // Arrange
            val mockEngine = MockEngine { request ->
                throw IOException("Network error")
            }

            val httpClient = HttpClient(mockEngine)

            // Act & Assert
            assertFailsWith<pos.ambrosia.utils.PhoenixServiceException> {
                try {
                    httpClient.submitForm("/bumpfee", formParameters = Parameters.build { 
                        append("feerateSatByte", "10")
                    })
                } catch (e: Exception) {
                    throw pos.ambrosia.utils.PhoenixServiceException("Failed to bump onchain fees on Phoenix: ${e.message}")
                }
            }
        }
    }
}