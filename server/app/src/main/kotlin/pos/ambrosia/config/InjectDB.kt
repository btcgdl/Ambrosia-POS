package pos.ambrosia.config

import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.coroutines.runBlocking
import java.io.File

object InjectDB
{

    private fun downloadDB(destination: File, tag: String): Boolean {
        val client = HttpClient(CIO)
        return try {
            runBlocking {
                val response: HttpResponse = client.get("https://github.com/btcgdl/Ambrosia-POS/releases/download/v${tag}/ambrosia-${tag}.db")
                if (response.status == HttpStatusCode.OK) {
                    destination.writeBytes(response.readRawBytes())
                    true
                } else {
                    false
                }
            }
        } catch (e: Exception) {
            println("Error downloading database: ${e.message}")
            false
        } finally {
            client.close()
        }
    }

    /**
     * Copies the database file from the project directory if it doesn't exist in config
     */
    fun ensureDatabase(datadir: String): Boolean {

        val dbFile = File(datadir, "ambrosia.db")

        if (dbFile.exists()) {
            return true
        }

        try {
            // Try to find the database file in the project db directory
            val projectRoot = File(System.getProperty("user.dir")).parentFile.parentFile
            val sourceDbFile = File(projectRoot, "db/ambrosia.db")
            
            if (!sourceDbFile.exists()) {
                
                // Fallback to downloading from GitHub
                if (!downloadDB(dbFile)) {
                    println("Failed to download database from GitHub")
                    return false
                }

            } else {
                sourceDbFile.copyTo(dbFile)
            }
            
            println("Database copied to ${dbFile.absolutePath}")
            return true
        } catch (e: Exception) {
            println("Error copying database: ${e.message}")
            return false
        }
    }
}
