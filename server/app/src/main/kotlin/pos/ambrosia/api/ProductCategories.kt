package pos.ambrosia.api

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.sql.Connection
import pos.ambrosia.db.DatabaseConnection
import pos.ambrosia.models.ProductCategory
import pos.ambrosia.services.ProductCategoryService

fun Application.configureProductCategories() {
  val connection: Connection = DatabaseConnection.getConnection()
  val service = ProductCategoryService(connection)
  routing { route("/product-categories") { productCategories(service) } }
}

fun Route.productCategories(service: ProductCategoryService) {
  authenticate("auth-jwt") {
    get("") {
      val items = service.getCategories()
      if (items.isEmpty()) {
        call.respond(HttpStatusCode.NoContent, "No product categories found")
        return@get
      }
      call.respond(HttpStatusCode.OK, items)
    }
    get("/{id}") {
      val id = call.parameters["id"] ?: return@get call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
      val item = service.getCategoryById(id) ?: return@get call.respond(HttpStatusCode.NotFound, "Product category not found")
      call.respond(HttpStatusCode.OK, item)
    }
    post("") {
      val body = call.receive<ProductCategory>()
      val id = service.addCategory(body)
      if (id == null) {
        call.respond(HttpStatusCode.BadRequest, "Failed to create product category")
        return@post
      }
      call.respond(HttpStatusCode.Created, mapOf("id" to id, "message" to "Product category added successfully"))
    }
    put("/{id}") {
      val id = call.parameters["id"] ?: return@put call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
      val body = call.receive<ProductCategory>()
      val ok = service.updateCategory(body.copy(id = id))
      if (!ok) {
        call.respond(HttpStatusCode.NotFound, "Product category with ID: $id not found")
        return@put
      }
      call.respond(HttpStatusCode.OK, mapOf("id" to id, "message" to "Product category updated successfully"))
    }
    delete("/{id}") {
      val id = call.parameters["id"] ?: return@delete call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
      val ok = service.deleteCategory(id)
      if (!ok) {
        call.respond(HttpStatusCode.BadRequest, "Cannot delete product category - it may be in use or not found")
        return@delete
      }
      call.respond(HttpStatusCode.NoContent, mapOf("id" to id, "message" to "Product category deleted successfully"))
    }
  }
}

