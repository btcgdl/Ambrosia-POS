package pos.ambrosia.api

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.sql.Connection
import pos.ambrosia.models.DishCategory
import pos.ambrosia.services.DishCategoryService
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
        if (id == null) {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
            return@get
        }
        
        val category = dishCategoryService.getDishCategoryById(id)
        if (category == null) {
            call.respond(HttpStatusCode.NotFound, "Dish category not found")
            return@get
        }
        
        call.respond(HttpStatusCode.OK, category)
    }

    post("") {
        val category = call.receive<DishCategory>()
        val createdId = dishCategoryService.addDishCategory(category)
        if (createdId == null) {
            call.respond(HttpStatusCode.BadRequest, "Failed to create dish category")
            return@post
        }
        call.respond(
                HttpStatusCode.Created,
                mapOf("id" to createdId, "message" to "Dish category added successfully")
        )
    }

    put("/{id}") {
        val id = call.parameters["id"]
        if (id == null) {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
            return@put
        }
        
        val updatedCategory = call.receive<DishCategory>()
        val categoryWithId = updatedCategory.copy(id = id)
        val isUpdated = dishCategoryService.updateDishCategory(categoryWithId)

        if (!isUpdated) {
            call.respond(HttpStatusCode.NotFound, "Dish category not found or update failed")
            return@put
        }
        
        call.respond(HttpStatusCode.OK, "Dish category updated successfully")
    }

    delete("/{id}") {
        val id = call.parameters["id"]
        if (id == null) {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
            return@delete
        }
        
        val isDeleted = dishCategoryService.deleteDishCategory(id)
        if (!isDeleted) {
            call.respond(
                    HttpStatusCode.BadRequest,
                    "Cannot delete dish category - it may be in use or not found"
            )
            return@delete
        }
        
        call.respond(HttpStatusCode.NoContent, "Dish category deleted successfully")
    }
}
