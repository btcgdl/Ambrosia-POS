package pos.ambrosia.api

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.sql.Connection
import pos.ambrosia.models.DishCategory
import pos.ambrosia.services.DishCategoryService
import pos.ambrosia.utils.UserNotFoundException
import pos.ambrosia.db.DatabaseConnection

fun Application.configureDishCategories() {
    val connection: Connection = DatabaseConnection.getConnection()
    val dishCategoryService = DishCategoryService(connection)
    routing { route("/dish-categories") { dishCategories(dishCategoryService) } }
}

fun Route.dishCategories(dishCategoryService: DishCategoryService) {
    get("") {
        val categories = dishCategoryService.getDishCategories()
        if (categories.isEmpty()) {
            call.respond(HttpStatusCode.NoContent, "No dish categories found")
            return@get
        }
        call.respond(HttpStatusCode.OK, categories)
    }

    get("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val category = dishCategoryService.getDishCategoryById(id)
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
        val category = call.receive<DishCategory>()
        val createdId = dishCategoryService.addDishCategory(category)
        if (createdId != null) {
            call.respond(
                    HttpStatusCode.Created,
                    mapOf("id" to createdId, "message" to "Dish category added successfully")
            )
        } else {
            call.respond(HttpStatusCode.BadRequest, "Failed to create dish category")
        }
    }

    put("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val updatedCategory = call.receive<DishCategory>()
            val categoryWithId = updatedCategory.copy(id = id)
            val isUpdated = dishCategoryService.updateDishCategory(categoryWithId)

            if (isUpdated) {
                call.respond(HttpStatusCode.OK, "Dish category updated successfully")
            } else {
                call.respond(HttpStatusCode.NotFound, "Dish category not found or update failed")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }

    delete("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val isDeleted = dishCategoryService.deleteDishCategory(id)
            if (isDeleted) {
                call.respond(HttpStatusCode.NoContent, "Dish category deleted successfully")
            } else {
                call.respond(
                        HttpStatusCode.BadRequest,
                        "Cannot delete dish category - it may be in use or not found"
                )
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
}
