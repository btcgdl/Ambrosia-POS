package pos.ambrosia.api

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import pos.ambrosia.db.connectToSqlite
import pos.ambrosia.logger
import pos.ambrosia.models.DishCategory
import pos.ambrosia.services.DishCategoryService

fun Application.configureDishCategories() {
    val connection = connectToSqlite()
    val dishCategoryService = DishCategoryService(connection)
    routing {
        route("/dish-categories") {
            dishCategories(dishCategoryService)
        }
    }
}

fun Route.dishCategories(dishCategoryService: DishCategoryService) {
    get("") {
        val categories = dishCategoryService.getCategories()
        if (categories.isEmpty()) {
            call.respond(HttpStatusCode.NoContent, "No categories found")
        } else {
            call.respond(HttpStatusCode.OK, categories)
        }
    }
    get("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val category = dishCategoryService.getCategoryById(id)
            if (category != null) {
                call.respond(HttpStatusCode.OK, category)
            } else {
                call.respond(HttpStatusCode.NotFound, "Category not found")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    post("") {
        val category = call.receive<DishCategory>()
        val generatedId = dishCategoryService.addCategory(category)
        if (generatedId != null) {
            call.respond(HttpStatusCode.Created, mapOf("id" to generatedId))
        } else {
            call.respond(HttpStatusCode.BadRequest, "Failed to create category")
        }
    }
    put("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val updatedCategory = call.receive<DishCategory>().copy(id = id)
            val isUpdated = dishCategoryService.updateCategory(updatedCategory)
            if (isUpdated) {
                call.respond(HttpStatusCode.OK, "Category updated successfully")
            } else {
                call.respond(HttpStatusCode.NotFound, "Category not found or invalid data")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
    delete("/{id}") {
        val id = call.parameters["id"]
        if (id != null) {
            val isDeleted = dishCategoryService.deleteCategory(id)
            if (isDeleted) {
                call.respond(HttpStatusCode.NoContent, "Category deleted successfully")
            } else {
                call.respond(HttpStatusCode.Conflict, "Cannot delete category: it is in use")
            }
        } else {
            call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        }
    }
}
