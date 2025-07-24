package pos.ambrosia.api

import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.sql.Connection
import pos.ambrosia.logger
import pos.ambrosia.models.Ingredient
import pos.ambrosia.services.IngredientService
import pos.ambrosia.utils.UserNotFoundException
import pos.ambrosia.db.DatabaseConnection

fun Application.configureIngredients() {
    val connection: Connection = DatabaseConnection.getConnection()
    val ingredientService = IngredientService(connection)
    routing { route("/ingredients") { ingredients(ingredientService) } }
}

fun Route.ingredients(ingredientService: IngredientService) {
    get("") {
        val ingredients = ingredientService.getIngredients()
        if (ingredients.isEmpty()) {
            call.respond(HttpStatusCode.NoContent, "No ingredients found")
            return@get
        }
        call.respond(HttpStatusCode.OK, ingredients)
    }
    get("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val ingredient = ingredientService.getIngredientById(id)
            if (ingredient != null) {
                call.respond(HttpStatusCode.OK, ingredient)
            } else {
                throw UserNotFoundException()
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    post("") {
        val ingredient = call.receive<Ingredient>()
        ingredientService.addIngredient(ingredient)
        call.respond(HttpStatusCode.Created, "Ingredient added successfully")
    }
    put("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val updatedIngredient = call.receive<Ingredient>()
            val isUpdated = ingredientService.updateIngredient(updatedIngredient)
            logger.info(isUpdated.toString())
            if (isUpdated) {
                call.respond(HttpStatusCode.OK, "Ingredient updated successfully")
            } else {
                call.respond(HttpStatusCode.NotFound, "Ingredient not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    delete("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val isDeleted = ingredientService.deleteIngredient(id)
            if (isDeleted) {
                call.respond(HttpStatusCode.OK, "Ingredient deleted successfully")
            } else {
                call.respond(HttpStatusCode.NotFound, "Ingredient not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    get("/low_stock/{threshold}") {
        val threshold = call.parameters["threshold"]?.toFloatOrNull()
        if (threshold == null) {
            call.respond(HttpStatusCode.BadRequest, "Invalid or missing threshold parameter")
            return@get
        }
        val lowStockIngredients = ingredientService.getLowStockIngredients() // Example threshold
        if (lowStockIngredients.isEmpty()) {
            call.respond(HttpStatusCode.NoContent, "No low stock ingredients found")
            return@get
        }
        call.respond(HttpStatusCode.OK, lowStockIngredients)
    }
}
