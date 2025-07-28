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
import pos.ambrosia.models.Dish
import pos.ambrosia.services.DishService

fun Application.configureDishes() {
  val connection: Connection = DatabaseConnection.getConnection()
  val dishService = DishService(connection)
  routing { route("/dishes") { dishes(dishService) } }
}

fun Route.dishes(dishService: DishService) {
  authenticate("auth-jwt") {
    get("") {
      val dishes = dishService.getDishes()
      if (dishes.isEmpty()) {
        call.respond(HttpStatusCode.NoContent, "No dishes found")
        return@get
      }
      call.respond(HttpStatusCode.OK, dishes)
    }
    get("/{id}") {
      val id = call.parameters["id"]
      if (id == null) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        return@get
      }

      val dish = dishService.getDishById(id)
      if (dish == null) {
        call.respond(HttpStatusCode.NotFound, "Dish not found")
        return@get
      }

      call.respond(HttpStatusCode.OK, dish)
    }
    post("") {
      val dish = call.receive<Dish>()
      dishService.addDish(dish)
      call.respond(HttpStatusCode.Created, "Dish added successfully")
    }
    put("/{id}") {
      val id = call.parameters["id"]
      if (id == null) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        return@put
      }

      val updatedDish = call.receive<Dish>()
      val isUpdated = dishService.updateDish(updatedDish)
      logger.info(isUpdated.toString())

      if (!isUpdated) {
        call.respond(HttpStatusCode.NotFound, "Dish not found")
        return@put
      }

      call.respond(HttpStatusCode.OK, "Dish updated successfully")
    }
    delete("/{id}") {
      val id = call.parameters["id"]
      if (id == null) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        return@delete
      }

      dishService.deleteDish(id)
      call.respond(HttpStatusCode.NoContent, "Dish deleted successfully")
    }
  }
}
