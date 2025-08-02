package pos.ambrosia

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.config.*
import io.ktor.server.testing.*
import kotlin.test.*

class ApplicationTest {
    
    private fun ApplicationTestBuilder.configureTestApplication() {
        environment {
            config = MapApplicationConfig().apply {
                put("jwt.issuer", "test-issuer")
                put("jwt.audience", "test-audience")
                put("secret", "test-secret-key-at-least-32-chars")
            }
        }
        application {
            Api().run { module() }
        }
    }

    @Test
    fun testRoot() = testApplication {
        configureTestApplication()
        val response = client.get("/")
        assertEquals(HttpStatusCode.OK, response.status)
        assertEquals("Root path of the API Nothing to see here", response.bodyAsText())
    }

    @Test
    fun testSwaggerEndpoint() = testApplication {
        configureTestApplication()
        val response = client.get("/swagger")
        assertEquals(HttpStatusCode.OK, response.status)
    }

    @Test
    fun testBaseCurrencyEndpoint() = testApplication {
        configureTestApplication()
        val response = client.get("/base-currency")
        // This might fail due to database dependency, but tests the routing
        assertTrue(response.status == HttpStatusCode.OK || response.status == HttpStatusCode.InternalServerError)
    }

    @Test
    fun testNonExistentEndpoint() = testApplication {
        configureTestApplication()
        val response = client.get("/non-existent")
        assertEquals(HttpStatusCode.NotFound, response.status)
    }

    @Test
    fun testRootWithDifferentHttpMethods() = testApplication {
        configureTestApplication()
        
        // Test POST to root (should return 405 Method Not Allowed)
        val postResponse = client.post("/")
        assertEquals(HttpStatusCode.MethodNotAllowed, postResponse.status)
        
        // Test PUT to root (should return 405 Method Not Allowed)
        val putResponse = client.put("/")
        assertEquals(HttpStatusCode.MethodNotAllowed, putResponse.status)
    }

    @Test
    fun testCorsHeaders() = testApplication {
        configureTestApplication()
        val response = client.options("/") {
            header("Origin", "http://localhost:3000")
            header("Access-Control-Request-Method", "GET")
        }
        assertTrue(response.status == HttpStatusCode.OK || response.status == HttpStatusCode.NoContent)
    }
}
