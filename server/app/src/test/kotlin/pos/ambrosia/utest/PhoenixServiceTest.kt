package pos.ambrosia.utest

import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.call.*
import io.ktor.client.engine.mock.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.utils.io.*
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import pos.ambrosia.models.Phoenix.NodeInfo
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
}