package pos.ambrosia

import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.core.main
import com.github.ajalt.clikt.parameters.options.*
import com.github.ajalt.clikt.parameters.types.int
import kotlin.io.path.Path

fun main(args: Array<String>) = Ambrosia()
    .main(args)
class Ambrosia: CliktCommand() {
    val datadir = Path(System.getProperty("user.home"), ".Ambrosia-POS")
    private val confFile = Path(datadir.toString(), "ambrosia.conf")

    val httpBindIp by option("--http-bind-ip", help = "Bind ip for the http api").default("127.0.0.1")
    val httpBindPort by option("--http-bind-port", help = "Bind port for the http api").int().default(9154)
    
    override fun run() {
        echo("Hello World!")
    }
}
