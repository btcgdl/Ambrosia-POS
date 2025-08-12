package pos.ambrosia.api

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.sql.Connection
import pos.ambrosia.db.DatabaseConnection
import pos.ambrosia.models.IngredientCategory
import pos.ambrosia.services.IngredientCategoryService

fun Application.configureIngredientCategories() {
  val connection: Connection = DatabaseConnection.getConnection()
  val ingredientCategoryService = IngredientCategoryService(connection)
  routing { route("/ingredient-categories") { ingredientCategories(ingredientCategoryService) } }
}

fun Route.ingredientCategories(ingredientCategoryService: IngredientCategoryService) {
  authenticate("auth-jwt") {
    get("") {
      val categories = ingredientCategoryService.getIngredientCategories()
      if (categories.isEmpty()) {
        call.respond(HttpStatusCode.NoContent, "No ingredient categories found")
        return@get
      }
      call.respond(HttpStatusCode.OK, categories)
    }

    get("/{id}") {
      val id = call.parameters["id"]
      if (id == null) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        return@get
      }

      val category = ingredientCategoryService.getIngredientCategoryById(id)
      if (category == null) {
        call.respond(HttpStatusCode.NotFound, "Ingredient category not found")
        return@get
      }

      call.respond(HttpStatusCode.OK, category)
    }

    post("") {
      val category = call.receive<IngredientCategory>()
      val createdId = ingredientCategoryService.addIngredientCategory(category)
      if (createdId == null) {
        call.respond(HttpStatusCode.BadRequest, "Failed to create ingredient category")
        return@post
      }
      call.respond(
              HttpStatusCode.Created,
              mapOf("id" to createdId, "message" to "Ingredient category added successfully")
      )
    }

    put("/{id}") {
      val id = call.parameters["id"]
      if (id == null) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        return@put
      }

      val updatedCategory = call.receive<IngredientCategory>()
      val categoryWithId = updatedCategory.copy(id = id)
      val isUpdated = ingredientCategoryService.updateIngredientCategory(categoryWithId)

      if (!isUpdated) {
        call.respond(HttpStatusCode.NotFound, "Ingredient category not found or update failed")
        return@put
      }

      call.respond(HttpStatusCode.OK, mapOf("id" to id, "message" to "Ingredient category updated successfully"))
    }

    delete("/{id}") {
      val id = call.parameters["id"]
      if (id == null) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        return@delete
      }

      val isDeleted = ingredientCategoryService.deleteIngredientCategory(id)
      if (!isDeleted) {
        call.respond(
                HttpStatusCode.BadRequest,
                "Cannot delete ingredient category - it may be in use or not found"
        )
        return@delete
      }

      call.respond(HttpStatusCode.NoContent, mapOf("id" to id, "message" to "Ingredient category deleted successfully"))
    }
  }
}
