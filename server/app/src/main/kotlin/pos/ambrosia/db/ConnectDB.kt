package pos.ambrosia.db

import java.sql.Connection
import java.sql.DriverManager
import java.sql.SQLException
import java.sql.Statement
import io.ktor.server.application.*
import org.slf4j.LoggerFactory

private val logger = LoggerFactory.getLogger("pos.ambrosia.App")
fun Application.connectToSqlite(): Connection
{
    // load the SQLite datapath from the config file
    val DBPath = environment.config.property("ktor.database.path").getString()
    return try {
        DriverManager.getConnection("jdbc:sqlite:$DBPath")
    } catch (e: SQLException) {
        logger.error("Error connecting to SQLite database: ${e.message}")
        logger.error("Shutting down the application use ./install.sh to install the application")
        System.exit(1) // Exit the program with a non-zero status
        throw IllegalStateException("This code should not be reached") // To satisfy the compiler
    }
}