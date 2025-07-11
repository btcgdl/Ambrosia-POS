package pos.ambrosia

import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.core.main
import com.github.ajalt.clikt.core.terminal
import com.github.ajalt.clikt.core.subcommands
import com.github.ajalt.clikt.parameters.options.*
import com.github.ajalt.clikt.parameters.types.int
import com.github.ajalt.mordant.rendering.TextColors.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import kotlinx.io.buffered
import kotlinx.io.files.Path
import kotlinx.io.files.SystemFileSystem
import kotlinx.io.writeString


fun main(args: Array<String>) = Ambrosia()
    .main(args)

class Ambrosia: CliktCommand() {
    val datadir = Path(Path(System.getProperty("user.home")), ".Ambrosia-POS")
    private val confFile = Path(datadir, "ambrosia.conf")

    val httpBindIp by option("--http-bind-ip", help = "Bind ip for the http api")
        .defaultLazy {
            val value = "127.0.0.1" // Default value
            SystemFileSystem.sink(this@Ambrosia.confFile, append = true).buffered()
                .use { it.writeString("\nhttp-ip=$value") }
            this@Ambrosia.terminal.println(white("done"))
            value
        }
    val httpBindPort by option("--http-bind-port", help = "Bind port for the http api").int()
        .defaultLazy {
            val value = 9154 // Default value
            SystemFileSystem.sink(this@Ambrosia.confFile, append = true).buffered()
                .use { it.writeString("\nhttp-port=$value") }
            this@Ambrosia.terminal.println(white("done"))
            value
        }
    init {
        this@Ambrosia.terminal.print(yellow("Loading configuration..."))

        SystemFileSystem.createDirectories(datadir)
        
    }
    override fun run() {
        echo("Starting Ambrosia POS Server...")
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
