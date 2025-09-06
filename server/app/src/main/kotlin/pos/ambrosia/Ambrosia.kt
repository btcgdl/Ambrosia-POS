package pos.ambrosia

import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.core.context
import com.github.ajalt.clikt.core.main
import com.github.ajalt.clikt.output.MordantHelpFormatter
import com.github.ajalt.clikt.parameters.groups.*
import com.github.ajalt.clikt.parameters.options.*
import com.github.ajalt.clikt.parameters.types.int
import com.github.ajalt.mordant.rendering.TextColors.*
import io.ktor.server.config.MapApplicationConfig
import io.ktor.server.engine.*
import io.ktor.server.cio.*
import kotlinx.io.buffered
import kotlinx.io.files.Path
import kotlinx.io.files.SystemFileSystem
import kotlinx.io.writeString
import pos.ambrosia.config.InjectDB
import pos.ambrosia.config.InjectLogs
import pos.ambrosia.config.ListValueSource
import pos.ambrosia.config.SeedGenerator

fun main(args: Array<String>) = Ambrosia().main(args)

class Ambrosia : CliktCommand() {
  // En algún archivo de configuración o en Application.kt
  val AppVersion: String = Ambrosia::class.java.getPackage().implementationVersion ?: "-dev"
  val datadir = Path(Path(System.getProperty("user.home")), ".Ambrosia-POS")
  private val confFile = Path(datadir, "ambrosia.conf")

  init {

    SystemFileSystem.createDirectories(datadir)
    InjectDB.ensureDatabase(datadir.toString(), AppVersion)
    InjectLogs.ensureLogConfig(datadir.toString())

    context {
      valueSource = ListValueSource.fromFile(confFile)
      helpFormatter = { MordantHelpFormatter(it, showDefaultValues = true) }
    }
  }
  inner class DaemonOptions : OptionGroup(name = "DaemonOptions") {
    val httpBindIp by
      option("--http-bind-ip", help = "Bind ip for the http api").defaultLazy {
        val value = "127.0.0.1" // Default value
        SystemFileSystem.sink(this@Ambrosia.confFile, append = true).buffered().use {
          it.writeString("\nhttp-bind-ip=$value")
        }
        value
      }
    val httpBindPort by
      option("--http-bind-port", help = "Bind port for the http api").int().defaultLazy {
        val value = 9154 // Dinnerefault value
        SystemFileSystem.sink(this@Ambrosia.confFile, append = true).buffered().use {
          it.writeString("\nhttp-bind-port=$value")
        }
        value
      }
    val secret by
      option("--secret", help = "Secret key for the server").defaultLazy {
        val seed = SeedGenerator.generateSeed() // Generate a new seed
        SystemFileSystem.sink(this@Ambrosia.confFile, append = true).buffered().use {
          it.writeString("\nsecret=$seed")
        }
        val hash = SeedGenerator.generateSecureSeed(seedInput = seed)
        SystemFileSystem.sink(this@Ambrosia.confFile, append = true).buffered().use {
          it.writeString("\nsecret-hash=$hash")
        }
        seed
      }
  }
  private val options by DaemonOptions()

  override fun run() {
    echo(green("Running Ambrosia POS Server v$AppVersion"))

    try {

      val server =
        embeddedServer(
          CIO,
          environment =
            applicationEnvironment {
              config =
                MapApplicationConfig().apply {
                  put("jwt.issuer", "ambrosia-pos")
                  put("jwt.audience", "ambrosia-pos-users")
                  put("secret", options.secret)
                }
            },
          configure = {
            connector {
              port = options.httpBindPort
              host = options.httpBindIp
            }
          },
          module = { Api().run { module() } }
        )
      server.start(wait = true)
    } catch (e: Exception) {
      echo("Error starting server: ${e.message}", err = true)
      throw e
    }
  }
}
