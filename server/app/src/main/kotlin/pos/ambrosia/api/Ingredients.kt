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
import pos.ambrosia.db.DatabaseConnection
import pos.ambrosia.logger
import pos.ambrosia.models.Ingredient
import pos.ambrosia.services.IngredientService

fun Application.configureIngredients() {
  val connection: Connection = DatabaseConnection.getConnection()
  val ingredientService = IngredientService(connection)
  routing { route("/ingredients") { ingredients(ingredientService) } }
}

fun Route.ingredients(ingredientService: IngredientService) {
  authenticate("auth-jwt") {
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
      if (id == null) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        return@get
      }

      val ingredient = ingredientService.getIngredientById(id)
      if (ingredient == null) {
        call.respond(HttpStatusCode.NotFound, "Ingredient not found")
        return@get
      }

      call.respond(HttpStatusCode.OK, ingredient)
    }
    post("") {
      val ingredient = call.receive<Ingredient>()
      val createdId = ingredientService.addIngredient(ingredient)
      call.respond(HttpStatusCode.Created, mapOf("id" to createdId, "message" to "Ingredient added successfully"))
    }
    put("/{id}") {
      val id = call.parameters["id"]
      if (id == null) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        return@put
      }

      val updatedIngredient = call.receive<Ingredient>()
      val isUpdated = ingredientService.updateIngredient(updatedIngredient.copy(id = id))
      logger.info(isUpdated.toString())

      if (!isUpdated) {
        call.respond(HttpStatusCode.NotFound, "Ingredient with ID: $id not found")
        return@put
      }

      call.respond(HttpStatusCode.OK, mapOf("id" to id, "message" to "Ingredient updated successfully"))
    }
    delete("/{id}") {
      val id = call.parameters["id"]
      if (id == null) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        return@delete
      }

      val isDeleted = ingredientService.deleteIngredient(id)
      if (!isDeleted) {
        call.respond(HttpStatusCode.NotFound, "Ingredient not found")
        return@delete
      }

      call.respond(HttpStatusCode.OK, mapOf("id" to id, "message" to "Ingredient deleted successfully"))
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
}
