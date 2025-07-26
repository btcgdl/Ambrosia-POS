package pos.ambrosia.api

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.auth.*
import io.ktor.server.plugins.swagger.*
import pos.ambrosia.services.BaseCurrencyService
import pos.ambrosia.db.DatabaseConnection
import java.sql.Connection

fun Application.configureRouting() {
    val connection: Connection = DatabaseConnection.getConnection()
    routing {
        swaggerUI(path = "/swagger", swaggerFile = "openapi/documentation.yaml")
        get("/") {
            //TODO: Add link to the documentation
            call.respondText("Root path of the API Nothing to see here")
        }
        get("/base-currency") {
            val baseCurrencyService = BaseCurrencyService(connection)
            val baseCurrency = baseCurrencyService.getBaseCurrency()
            call.respond(mapOf("currency_id" to baseCurrency))
        }
    }
}
