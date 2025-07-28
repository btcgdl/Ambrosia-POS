package pos.ambrosia.services

import java.sql.Connection
import pos.ambrosia.logger
import pos.ambrosia.models.IngredientCategory

class IngredientCategoryService(private val connection: Connection) {
  companion object {
    private const val ADD_CATEGORY = "INSERT INTO ingredient_categories (id, name) VALUES (?, ?)"
    private const val GET_CATEGORIES =
            "SELECT id, name FROM ingredient_categories WHERE is_deleted = 0"
    private const val GET_CATEGORY_BY_ID =
            "SELECT id, name FROM ingredient_categories WHERE id = ? AND is_deleted = 0"
    private const val UPDATE_CATEGORY = "UPDATE ingredient_categories SET name = ? WHERE id = ?"
    private const val DELETE_CATEGORY =
            "UPDATE ingredient_categories SET is_deleted = 1 WHERE id = ?"
    private const val CHECK_CATEGORY_IN_USE =
            "SELECT COUNT(*) as count FROM ingredients WHERE category_id = ? AND is_deleted = 0"
    private const val CHECK_NAME_EXISTS =
            "SELECT id FROM ingredient_categories WHERE name = ? AND is_deleted = 0 AND id != ?"
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

  private fun mapResultSetToIngredientCategory(resultSet: java.sql.ResultSet): IngredientCategory {
    return IngredientCategory(id = resultSet.getString("id"), name = resultSet.getString("name"))
  }

  suspend fun addIngredientCategory(category: IngredientCategory): String? {
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
      logger.info("Ingredient category created successfully with ID: $generatedId")
      generatedId
    } else {
      logger.error("Failed to create ingredient category")
      null
    }
  }

  suspend fun getIngredientCategories(): List<IngredientCategory> {
    val statement = connection.prepareStatement(GET_CATEGORIES)
    val resultSet = statement.executeQuery()
    val categories = mutableListOf<IngredientCategory>()
    while (resultSet.next()) {
      categories.add(mapResultSetToIngredientCategory(resultSet))
    }
    logger.info("Retrieved ${categories.size} ingredient categories")
    return categories
  }

  suspend fun getIngredientCategoryById(id: String): IngredientCategory? {
    val statement = connection.prepareStatement(GET_CATEGORY_BY_ID)
    statement.setString(1, id)
    val resultSet = statement.executeQuery()
    return if (resultSet.next()) {
      mapResultSetToIngredientCategory(resultSet)
    } else {
      logger.warn("Ingredient category not found with ID: $id")
      null
    }
  }

  suspend fun updateIngredientCategory(category: IngredientCategory): Boolean {
    if (category.id == null) {
      logger.error("Cannot update ingredient category: ID is null")
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
      logger.info("Ingredient category updated successfully: ${category.id}")
    } else {
      logger.error("Failed to update ingredient category: ${category.id}")
    }
    return rowsUpdated > 0
  }

  suspend fun deleteIngredientCategory(id: String): Boolean {
    // Verificar que la categoría no esté siendo usada en ingredientes
    if (categoryInUse(id)) {
      logger.error("Cannot delete ingredient category $id: it's being used by ingredients")
      return false
    }

    val statement = connection.prepareStatement(DELETE_CATEGORY)
    statement.setString(1, id)
    val rowsDeleted = statement.executeUpdate()

    if (rowsDeleted > 0) {
      logger.info("Ingredient category soft-deleted successfully: $id")
    } else {
      logger.error("Failed to delete ingredient category: $id")
    }
    return rowsDeleted > 0
  }
}
