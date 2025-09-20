package e2e

import io.ktor.client.HttpClient
import io.ktor.client.request.get
import io.ktor.http.HttpStatusCode
import kotlinx.coroutines.runBlocking
import org.junit.AfterClass
import org.junit.BeforeClass
import java.io.File
import kotlin.jvm.JvmStatic

abstract class TestServer {
    companion object {
        private var serverProcess: Process? = null
        private const val SERVER_PORT = 9154
        private const val SERVER_HOST = "127.0.0.1"
        private const val HEALTH_CHECK_URL = "http://$SERVER_HOST:$SERVER_PORT/"

        @BeforeClass
        @JvmStatic
        fun runServer() {
            serverProcess = runGradleApp()
            waitForServer()
        }

        @AfterClass
        @JvmStatic
        fun stopServer() {
            serverProcess?.destroyForcibly()
        }

        private fun runGradleApp(): Process {
            val command = listOf("./gradlew", "run", "--no-daemon")
            val processBuilder = ProcessBuilder(command)
            processBuilder.directory(File(".."))
            return processBuilder.start()
        }

        private fun waitForServer() {
            val startTime = System.currentTimeMillis()
            val timeout = 30 * 1000 // 30 seconds
            val client = HttpClient()

            while (System.currentTimeMillis() - startTime < timeout) {
                try {
                    val status = runBlocking {
                        client.get(HEALTH_CHECK_URL).status
                    }
                    if (status == HttpStatusCode.OK) {
                        client.close()
                        return
                    }
                } catch (e: Exception) {
                    // Server not ready yet, wait and retry
                }
                Thread.sleep(1000) // Wait 1 second before retrying
            }
            client.close()
            throw RuntimeException("Server did not start within the timeout period.")
        }
    }
}