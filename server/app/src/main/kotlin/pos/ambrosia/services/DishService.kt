package pos.ambrosia.services

import java.sql.Connection
import pos.ambrosia.models.Dish

class DishService(private val connection: Connection) {
    companion object {
        private const val ADD_DISH =
                "INSERT INTO dishes (id, name, price, category_id) VALUES (?, ?, ?, ?)"
        private const val GET_DISHES =
                "SELECT id, name, price, category_id FROM dishes WHERE is_deleted = 0"
        private const val GET_DISH_BY_ID =
                "SELECT id, name, price, category_id FROM dishes WHERE id = ? AND is_deleted = 0"
        private const val UPDATE_DISH =
                "UPDATE dishes SET name = ?, price = ?, category_id = ? WHERE id = ?"
        private const val DELETE_DISH = "UPDATE dishes SET is_deleted = 1 WHERE id = ?"
    }

    fun addDish(dish: Dish): Boolean {
        val statement = connection.prepareStatement(ADD_DISH)
        statement.setString(1, dish.id)
        statement.setString(2, dish.name)
        statement.setFloat(3, dish.price)
        statement.setString(4, dish.category_id)
        return statement.executeUpdate() > 0
    }

    fun getDishes(): List<Dish> {
        val statement = connection.prepareStatement(GET_DISHES)
        val resultSet = statement.executeQuery()
        val dishes = mutableListOf<Dish>()
        while (resultSet.next()) {
            val dish =
                    Dish(
                            id = resultSet.getString("id"),
                            name = resultSet.getString("name"),
                            price = resultSet.getFloat("price"),
                            category_id = resultSet.getString("category_id")
                    )
            dishes.add(dish)
        }
        return dishes
    }

    fun getDishById(id: String): Dish? {
        val statement = connection.prepareStatement(GET_DISH_BY_ID)
        statement.setString(1, id)
        val resultSet = statement.executeQuery()
        return if (resultSet.next()) {
            Dish(
                    id = resultSet.getString("id"),
                    name = resultSet.getString("name"),
                    price = resultSet.getFloat("price"),
                    category_id = resultSet.getString("category_id")
            )
        } else {
            null
        }
    }

    fun updateDish(dish: Dish): Boolean {
        val statement = connection.prepareStatement(UPDATE_DISH)
        statement.setString(1, dish.name)
        statement.setFloat(2, dish.price)
        statement.setString(3, dish.category_id)
        statement.setString(4, dish.id)
        return statement.executeUpdate() > 0
    }
    fun deleteDish(id: String): Boolean {
        val statement = connection.prepareStatement(DELETE_DISH)
        statement.setString(1, id)
        return statement.executeUpdate() > 0
    }
}
