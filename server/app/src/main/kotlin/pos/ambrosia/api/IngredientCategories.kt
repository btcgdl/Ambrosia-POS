package pos.ambrosia.api

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.sql.Connection
import pos.ambrosia.models.IngredientCategory
import pos.ambrosia.services.IngredientCategoryService
import pos.ambrosia.utils.UserNotFoundException
import pos.ambrosia.db.DatabaseConnection

fun Application.configureIngredientCategories() {
    val connection: Connection = DatabaseConnection.getConnection()
    val ingredientCategoryService = IngredientCategoryService(connection)
    routing { route("/ingredient-categories") { ingredientCategories(ingredientCategoryService) } }
}

fun Route.ingredientCategories(ingredientCategoryService: IngredientCategoryService) {
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
        if (id != null) {
            val category = ingredientCategoryService.getIngredientCategoryById(id)
            if (category != null) {
                call.respond(HttpStatusCode.OK, category)
            } else {
                throw UserNotFoundException()
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }

    post("") {
        val category = call.receive<IngredientCategory>()
        val createdId = ingredientCategoryService.addIngredientCategory(category)
        if (createdId != null) {
            call.respond(
                    HttpStatusCode.Created,
                    mapOf("id" to createdId, "message" to "Ingredient category added successfully")
            )
        } else {
            call.respond(HttpStatusCode.BadRequest, "Failed to create ingredient category")
        }
    }

    put("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val updatedCategory = call.receive<IngredientCategory>()
            val categoryWithId = updatedCategory.copy(id = id)
            val isUpdated = ingredientCategoryService.updateIngredientCategory(categoryWithId)

            if (isUpdated) {
                call.respond(HttpStatusCode.OK, "Ingredient category updated successfully")
            } else {
                call.respond(
                        HttpStatusCode.NotFound,
                        "Ingredient category not found or update failed"
                )
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }

    delete("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val isDeleted = ingredientCategoryService.deleteIngredientCategory(id)
            if (isDeleted) {
                call.respond(HttpStatusCode.NoContent, "Ingredient category deleted successfully")
            } else {
                call.respond(
                        HttpStatusCode.BadRequest,
                        "Cannot delete ingredient category - it may be in use or not found"
                )
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
}
