// package pos.ambrosia.utest

// import io.ktor.client.engine.mock.* 
// import io.ktor.http.*
// import io.ktor.server.application.*
// import io.ktor.server.config.*
// import io.ktor.utils.io.*
// import kotlinx.coroutines.runBlocking
// import org.mockito.kotlin.*
// import pos.ambrosia.models.Phoenix.NodeInfo
// import pos.ambrosia.services.PhoenixService
// import kotlin.test.Test
// import kotlin.test.assertEquals

// class PhoenixServiceTest {

//     private val mockConfig: ApplicationConfig = mock()
//     private val mockEnv: ApplicationEnvironment = mock {
//         on { config } doReturn mockConfig
//     }

//     @Test
//     fun `getNodeInfo fails on connection despite being a complete success test`() {
//         // Arrange: Define a perfect, successful response.
//         val mockJsonResponse = """
//             {
//                 "nodeId": "02f3c93f2bsd...",
//                 "channels": [],
//                 "chain": "mainnet",
//                 "blockHeight": 800000,
//                 "version": "v0.1.0"
//             }
//         """.trimIndent()

//         // Arrange: Create a MockEngine that would deliver this perfect response.
//         // NOTE: This MockEngine is created but is NEVER used by the PhoenixService.
//         val mockEngine = MockEngine { request ->
//             respond(
//                 content = ByteReadChannel(mockJsonResponse.toByteArray(Charsets.UTF_8)),
//                 status = HttpStatusCode.OK,
//                 headers = headersOf(HttpHeaders.ContentType, "application/json")
//             )
//         }

//         // Arrange: Mock the environment configuration.
//         val mockUrlValue: ApplicationConfigValue = mock()
//         whenever(mockUrlValue.getString()).thenReturn("http://localhost:9285")
//         whenever(mockConfig.property("phoenixd-url")).thenReturn(mockUrlValue)

//         val mockPasswordValue: ApplicationConfigValue = mock()
//         whenever(mockPasswordValue.getString()).thenReturn("testpassword")
//         whenever(mockConfig.property("phoenixd-password")).thenReturn(mockPasswordValue)

//         val phoenixService = PhoenixService(mockEnv)

//         // Act & Assert: Call the method and expect a successful result.
//         // THE TEST WILL FAIL ON THE NEXT LINE because the service uses its
//         // internal, real HttpClient, not our mockEngine.
//         val nodeInfo = runBlocking {
//             phoenixService.getNodeInfo()
//         }

//         // Assert: These assertions are correct, but will never be reached.
//         assertEquals("mainnet", nodeInfo.chain)
//         assertEquals(800000, nodeInfo.blockHeight)
//         assertEquals("v0.1.0", nodeInfo.version)
//     }
// }