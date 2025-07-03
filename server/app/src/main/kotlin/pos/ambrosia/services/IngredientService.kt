package pos.ambrosia.services

import java.sql.Connection
import pos.ambrosia.models.Ingredient

class IngredientService(private val connection: Connection) {
    companion object {
        private const val ADD_INGREDIENT =
                "INSERT INTO ingredients (id, name, category_id, quantity, unit, low_stock_threshold, cost_per_unit) VALUES (?, ?, ?, ?, ?, ?, ?)"
        private const val GET_INGREDIENTS =
                "SELECT id, name, category_id, quantity, unit, low_stock_threshold, cost_per_unit FROM ingredients WHERE is_deleted = 0"
        private const val GET_INGREDIENT_BY_ID =
                "SELECT id, name, category_id, quantity, unit, low_stock_threshold, cost_per_unit FROM ingredients WHERE id = ? AND is_deleted = 0"
        private const val UPDATE_INGREDIENT =
                "UPDATE ingredients SET name = ?, category_id = ?, quantity = ?, unit = ?, low_stock_threshold = ?, cost_per_unit = ? WHERE id = ?"
        private const val DELETE_INGREDIENT = "UPDATE ingredients SET is_deleted = 1 WHERE id = ?"
    }

    fun addIngredient(ingredient: Ingredient): Boolean {
        val statement = connection.prepareStatement(ADD_INGREDIENT)
        statement.setString(1, ingredient.id)
        statement.setString(2, ingredient.naame)
        statement.setString(3, ingredient.category_id)
        statement.setFloat(4, ingredient.quantity)
        statement.setString(5, ingredient.unit)
        statement.setFloat(6, ingredient.low_stock_threshold)
        statement.setFloat(7, ingredient.cost_per_unit)
        return statement.executeUpdate() > 0
    }

    fun getIngredients(): List<Ingredient> {
        val statement = connection.prepareStatement(GET_INGREDIENTS)
        val resultSet = statement.executeQuery()
        val ingredients = mutableListOf<Ingredient>()
        while (resultSet.next()) {
            val ingredient =
                    Ingredient(
                            id = resultSet.getString("id"),
                            naame = resultSet.getString("name"),
                            category_id = resultSet.getString("category_id"),
                            quantity = resultSet.getFloat("quantity"),
                            unit = resultSet.getString("unit"),
                            low_stock_threshold = resultSet.getFloat("low_stock_threshold"),
                            cost_per_unit = resultSet.getFloat("cost_per_unit")
                    )
            ingredients.add(ingredient)
        }
        return ingredients
    }

    fun getIngredientById(id: String): Ingredient? {
        val statement = connection.prepareStatement(GET_INGREDIENT_BY_ID)
        statement.setString(1, id)
        val resultSet = statement.executeQuery()
        return if (resultSet.next()) {
            Ingredient(
                    id = resultSet.getString("id"),
                    naame = resultSet.getString("name"),
                    category_id = resultSet.getString("category_id"),
                    quantity = resultSet.getFloat("quantity"),
                    unit = resultSet.getString("unit"),
                    low_stock_threshold = resultSet.getFloat("low_stock_threshold"),
                    cost_per_unit = resultSet.getFloat("cost_per_unit")
            )
        } else {
            null
        }
    }

    fun updateIngredient(ingredient: Ingredient): Boolean {
        val statement = connection.prepareStatement(UPDATE_INGREDIENT)
        statement.setString(1, ingredient.naame)
        statement.setString(2, ingredient.category_id)
        statement.setFloat(3, ingredient.quantity)
        statement.setString(4, ingredient.unit)
        statement.setFloat(5, ingredient.low_stock_threshold)
        statement.setFloat(6, ingredient.cost_per_unit)
        statement.setString(7, ingredient.id)
        return statement.executeUpdate() > 0
    }

    fun deleteIngredient(id: String): Boolean {
        val statement = connection.prepareStatement(DELETE_INGREDIENT)
        statement.setString(1, id)
        return statement.executeUpdate() > 0
    }

    fun getLowStockIngredients(threshold: Float): List<Ingredient> {
        val statement =
                connection.prepareStatement(
                        "SELECT id, name, category_id, quantity, unit, low_stock_threshold, cost_per_unit FROM ingredients WHERE quantity < ? AND is_deleted = 0"
                )
        statement.setFloat(1, threshold)
        val resultSet = statement.executeQuery()
        val lowStockIngredients = mutableListOf<Ingredient>()
        while (resultSet.next()) {
            val ingredient =
                    Ingredient(
                            id = resultSet.getString("id"),
                            naame = resultSet.getString("name"),
                            category_id = resultSet.getString("category_id"),
                            quantity = resultSet.getFloat("quantity"),
                            unit = resultSet.getString("unit"),
                            low_stock_threshold = resultSet.getFloat("low_stock_threshold"),
                            cost_per_unit = resultSet.getFloat("cost_per_unit")
                    )
            lowStockIngredients.add(ingredient)
        }
        return lowStockIngredients
    }
}
