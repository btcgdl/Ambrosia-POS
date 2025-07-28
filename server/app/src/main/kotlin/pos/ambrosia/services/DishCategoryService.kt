package pos.ambrosia.services

import java.sql.Connection
import pos.ambrosia.logger
import pos.ambrosia.models.DishCategory

class DishCategoryService(private val connection: Connection) {
  companion object {
    private const val ADD_CATEGORY = "INSERT INTO dish_categories (id, name) VALUES (?, ?)"
    private const val GET_CATEGORIES = "SELECT id, name FROM dish_categories WHERE is_deleted = 0"
    private const val GET_CATEGORY_BY_ID =
            "SELECT id, name FROM dish_categories WHERE id = ? AND is_deleted = 0"
    private const val UPDATE_CATEGORY = "UPDATE dish_categories SET name = ? WHERE id = ?"
    private const val DELETE_CATEGORY = "UPDATE dish_categories SET is_deleted = 1 WHERE id = ?"
    private const val CHECK_CATEGORY_IN_USE =
            "SELECT COUNT(*) as count FROM dishes WHERE category_id = ? AND is_deleted = 0"
    private const val CHECK_NAME_EXISTS =
            "SELECT id FROM dish_categories WHERE name = ? AND is_deleted = 0 AND id != ?"
  }

  private fun categoryInUse(categoryId: String): Boolean {
    val statement = connection.prepareStatement(CHECK_CATEGORY_IN_USE)
    statement.setString(1, categoryId)
    val resultSet = statement.executeQuery()
    if (resultSet.next()) {
      return resultSet.getInt("count") > 0
    }
    return false
  }

  private fun nameExists(name: String, excludeId: String? = null): Boolean {
    val statement = connection.prepareStatement(CHECK_NAME_EXISTS)
    statement.setString(1, name)
    statement.setString(2, excludeId ?: "")
    val resultSet = statement.executeQuery()
    return resultSet.next()
  }

  private fun mapResultSetToDishCategory(resultSet: java.sql.ResultSet): DishCategory {
    return DishCategory(id = resultSet.getString("id"), name = resultSet.getString("name"))
  }

  suspend fun addDishCategory(category: DishCategory): String? {
    // Validar datos
    if (category.name.isBlank()) {
      logger.error("Category name cannot be blank")
      return null
    }

    // Verificar que el nombre no existe
    if (nameExists(category.name)) {
      logger.error("Category name already exists: ${category.name}")
      return null
    }

    val generatedId = java.util.UUID.randomUUID().toString()
    val statement = connection.prepareStatement(ADD_CATEGORY)

    statement.setString(1, generatedId)
    statement.setString(2, category.name)

    val rowsAffected = statement.executeUpdate()

    return if (rowsAffected > 0) {
      logger.info("Dish category created successfully with ID: $generatedId")
      generatedId
    } else {
      logger.error("Failed to create dish category")
      null
    }
  }

  suspend fun getDishCategories(): List<DishCategory> {
    val statement = connection.prepareStatement(GET_CATEGORIES)
    val resultSet = statement.executeQuery()
    val categories = mutableListOf<DishCategory>()
    while (resultSet.next()) {
      categories.add(mapResultSetToDishCategory(resultSet))
    }
    logger.info("Retrieved ${categories.size} dish categories")
    return categories
  }

  suspend fun getDishCategoryById(id: String): DishCategory? {
    val statement = connection.prepareStatement(GET_CATEGORY_BY_ID)
    statement.setString(1, id)
    val resultSet = statement.executeQuery()
    return if (resultSet.next()) {
      mapResultSetToDishCategory(resultSet)
    } else {
      logger.warn("Dish category not found with ID: $id")
      null
    }
  }

  suspend fun updateDishCategory(category: DishCategory): Boolean {
    if (category.id == null) {
      logger.error("Cannot update dish category: ID is null")
      return false
    }

    // Validar datos
    if (category.name.isBlank()) {
      logger.error("Category name cannot be blank")
      return false
    }

    // Verificar que el nombre no existe (excluyendo el ID actual)
    if (nameExists(category.name, category.id)) {
      logger.error("Category name already exists: ${category.name}")
      return false
    }

    val statement = connection.prepareStatement(UPDATE_CATEGORY)
    statement.setString(1, category.name)
    statement.setString(2, category.id)

    val rowsUpdated = statement.executeUpdate()
    if (rowsUpdated > 0) {
      logger.info("Dish category updated successfully: ${category.id}")
    } else {
      logger.error("Failed to update dish category: ${category.id}")
    }
    return rowsUpdated > 0
  }

  suspend fun deleteDishCategory(id: String): Boolean {
    // Verificar que la categoría no esté siendo usada en platos
    if (categoryInUse(id)) {
      logger.error("Cannot delete dish category $id: it's being used by dishes")
      return false
    }

    val statement = connection.prepareStatement(DELETE_CATEGORY)
    statement.setString(1, id)
    val rowsDeleted = statement.executeUpdate()

    if (rowsDeleted > 0) {
      logger.info("Dish category soft-deleted successfully: $id")
    } else {
      logger.error("Failed to delete dish category: $id")
    }
    return rowsDeleted > 0
  }
}
