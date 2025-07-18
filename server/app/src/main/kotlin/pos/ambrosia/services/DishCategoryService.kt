package pos.ambrosia.services

import java.sql.Connection
import pos.ambrosia.logger
import pos.ambrosia.models.DishCategory

class DishCategoryService(private val connection: Connection) {
    companion object {
        private const val ADD_CATEGORY =
            "INSERT INTO dish_categories (id, name) VALUES (?, ?)"
        private const val GET_CATEGORIES =
            "SELECT id, name FROM dish_categories WHERE is_deleted = 0"
        private const val GET_CATEGORY_BY_ID =
            "SELECT id, name FROM dish_categories WHERE id = ? AND is_deleted = 0"
        private const val UPDATE_CATEGORY =
            "UPDATE dish_categories SET name = ? WHERE id = ?"
        private const val DELETE_CATEGORY =
            "UPDATE dish_categories SET is_deleted = 1 WHERE id = ?"
        private const val CHECK_CATEGORY_IN_USE =
            "SELECT COUNT(*) as count FROM dishes WHERE category_id = ? AND is_deleted = 0"
    }

    private fun mapResultSetToCategory(resultSet: java.sql.ResultSet): DishCategory {
        return DishCategory(
            id = resultSet.getString("id"),
            name = resultSet.getString("name")
        )
    }

    suspend fun addCategory(category: DishCategory): String? {
        if (category.name.isBlank()) {
            logger.error("Category name cannot be blank")
            return null
        }

        val generatedId = java.util.UUID.randomUUID().toString()
        val statement = connection.prepareStatement(ADD_CATEGORY)
        statement.setString(1, generatedId)
        statement.setString(2, category.name)

        val rowsAffected = statement.executeUpdate()
        return if (rowsAffected > 0) {
            logger.info("Category created successfully with ID: $generatedId")
            generatedId
        } else {
            logger.error("Failed to create category")
            null
        }
    }

    suspend fun getCategories(): List<DishCategory> {
        val statement = connection.prepareStatement(GET_CATEGORIES)
        val resultSet = statement.executeQuery()
        val categories = mutableListOf<DishCategory>()
        while (resultSet.next()) {
            categories.add(mapResultSetToCategory(resultSet))
        }
        logger.info("Retrieved ${categories.size} categories")
        return categories
    }

    suspend fun getCategoryById(id: String): DishCategory? {
        val statement = connection.prepareStatement(GET_CATEGORY_BY_ID)
        statement.setString(1, id)
        val resultSet = statement.executeQuery()
        return if (resultSet.next()) {
            mapResultSetToCategory(resultSet)
        } else {
            logger.warn("Category not found with ID: $id")
            null
        }
    }

    suspend fun updateCategory(category: DishCategory): Boolean {
        if (category.id == null) {
            logger.error("Cannot update category: ID is null")
            return false
        }
        if (category.name.isBlank()) {
            logger.error("Category name cannot be blank")
            return false
        }

        val statement = connection.prepareStatement(UPDATE_CATEGORY)
        statement.setString(1, category.name)
        statement.setString(2, category.id)

        val rowsUpdated = statement.executeUpdate()
        if (rowsUpdated > 0) {
            logger.info("Category updated successfully: ${category.id}")
        } else {
            logger.error("Failed to update category: ${category.id}")
        }
        return rowsUpdated > 0
    }

    suspend fun deleteCategory(id: String): Boolean {
        // Verificar que no existan platos asociados
        val checkStatement = connection.prepareStatement(CHECK_CATEGORY_IN_USE)
        checkStatement.setString(1, id)
        val resultSet = checkStatement.executeQuery()
        if (resultSet.next() && resultSet.getInt("count") > 0) {
            logger.error("Cannot delete category $id: it is in use by dishes")
            return false
        }

        val statement = connection.prepareStatement(DELETE_CATEGORY)
        statement.setString(1, id)
        val rowsDeleted = statement.executeUpdate()

        if (rowsDeleted > 0) {
            logger.info("Category soft-deleted successfully: $id")
        } else {
            logger.error("Failed to delete category: $id")
        }
        return rowsDeleted > 0
    }
}
