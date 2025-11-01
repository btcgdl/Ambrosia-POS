package pos.ambrosia.api

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.sql.Connection
import pos.ambrosia.db.DatabaseConnection
import pos.ambrosia.models.CategoryItem
import pos.ambrosia.models.CategoryUpsert
import pos.ambrosia.services.CategoryService

fun Application.configureCategories() {
  val connection: Connection = DatabaseConnection.getConnection()
  val service = CategoryService(connection)
  routing { route("/categories") { categories(service) } }
}

fun Route.categories(service: CategoryService) {
  authenticate("auth-jwt") {
    get("") {
      val type = call.request.queryParameters["type"]
      if (type.isNullOrBlank()) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed type")
        return@get
      }
      val items = service.getCategories(type)
      if (items.isEmpty()) {
        call.respond(HttpStatusCode.NoContent, "No categories found")
        return@get
      }
      call.respond(HttpStatusCode.OK, items)
    }

    get("/{id}") {
      val id = call.parameters["id"]
      val type = call.request.queryParameters["type"]
      if (id.isNullOrBlank() || type.isNullOrBlank()) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID/type")
        return@get
      }
      val item = service.getCategoryById(id, type)
      if (item == null) {
        call.respond(HttpStatusCode.NotFound, "Category not found")
        return@get
      }
      call.respond(HttpStatusCode.OK, item)
    }

    post("") {
      val body = call.receive<CategoryUpsert>()
      val type = body.type
      if (type.isNullOrBlank()) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed type")
        return@post
      }
      val id = service.addCategory(type, CategoryItem(name = body.name))
      if (id == null) {
        call.respond(HttpStatusCode.BadRequest, "Failed to create category")
        return@post
      }
      call.respond(HttpStatusCode.Created, mapOf("id" to id, "message" to "Category added successfully"))
    }

    put("/{id}") {
      val id = call.parameters["id"]
      val body = call.receive<CategoryUpsert>()
      val type = body.type
      if (id.isNullOrBlank() || type.isNullOrBlank()) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID/type")
        return@put
      }
      val ok = service.updateCategory(type, CategoryItem(id = id, name = body.name))
      if (!ok) {
        call.respond(HttpStatusCode.NotFound, "Category with ID: $id not found")
        return@put
      }
      call.respond(HttpStatusCode.OK, mapOf("id" to id, "message" to "Category updated successfully"))
    }

    delete("/{id}") {
      val id = call.parameters["id"]
      val type = call.request.queryParameters["type"]
      if (id.isNullOrBlank() || type.isNullOrBlank()) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID/type")
        return@delete
      }
      val ok = service.deleteCategory(id, type)
      if (!ok) {
        call.respond(HttpStatusCode.BadRequest, "Cannot delete category - it may be in use or not found")
        return@delete
      }
      call.respond(HttpStatusCode.NoContent, mapOf("id" to id, "message" to "Category deleted successfully"))
    }
  }
}

