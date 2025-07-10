package pos.ambrosia

import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.core.main
import com.github.ajalt.clikt.core.subcommands
import com.github.ajalt.clikt.parameters.options.*
import com.github.ajalt.clikt.parameters.types.int
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import pos.ambrosia.commands.GenerateSeedCommand
import kotlinx.io.files.SystemFileSystem
import kotlinx.io.files.Path

fun main(args: Array<String>) = Ambrosia()
    .main(args)
    
class Ambrosia: CliktCommand() {
    val datadir = Path(Path(System.getProperty("user.home")), ".phoenix")
    private val confFile = Path(datadir, "ambrosia.conf")

    val httpBindIp by option("--http-bind-ip", help = "Bind ip for the http api").default("127.0.0.1")
    val httpBindPort by option("--http-bind-port", help = "Bind port for the http api").int().default(9154)
    init {
        SystemFileSystem.createDirectories(datadir)
    }
    override fun run() {
        echo("Starting Ambrosia POS Server...")
        echo("Configuring Ktor with Netty engine...")
        echo("HTTP API will be available at http://$httpBindIp:$httpBindPort")
        echo("Health check endpoint: http://$httpBindIp:$httpBindPort/")
        echo("API documentation: http://$httpBindIp:$httpBindPort/swagger")
        
        try {
            val server = embeddedServer(
            Netty,
            environment = applicationEnvironment {

            },
            configure = {
                connector {
                    port = httpBindPort
                    host = httpBindIp
                }
            },
            module = {
                Api().run { module() }
            }
        )
            
            echo("Server starting...")
            server.start(wait = true)
        } catch (e: Exception) {
            echo("Error starting server: ${e.message}", err = true)
            throw e
        }
    }
}
