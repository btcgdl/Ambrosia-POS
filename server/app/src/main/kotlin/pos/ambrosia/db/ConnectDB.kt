package pos.ambrosia.db

import java.sql.Connection
import java.sql.DriverManager
import java.sql.SQLException
import java.sql.Statement
import io.ktor.server.application.*


fun Application.connectToSqlite(): Connection
{
    // load the SQLite datapath from the config file
    val DBPath = environment.config.property("ktor.database.path").getString()
    return try {
        DriverManager.getConnection("jdbc:sqlite:$DBPath")

    } catch (e: SQLException) {
        throw RuntimeException("Error connecting to the database", e)
    }
}