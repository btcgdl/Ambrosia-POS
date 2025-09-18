package pos.ambrosia.services

import java.sql.Connection
import pos.ambrosia.logger
import pos.ambrosia.models.Config

class ConfigService(private val connection: Connection) {
    companion object {
        private const val GET_CONFIG = "SELECT id, restaurant_name, address, phone, email, tax_id, logo FROM config WHERE id = 1"
        private const val UPDATE_CONFIG = "INSERT OR REPLACE INTO config (id, restaurant_name, address, phone, email, tax_id, logo) VALUES (1, ?, ?, ?, ?, ?, ?)"
    }

    suspend fun getConfig(): Config? {
        val statement = connection.prepareStatement(GET_CONFIG)
        val resultSet = statement.executeQuery()
        return if (resultSet.next()) {
            Config(
                id = resultSet.getInt("id"),
                restaurantName = resultSet.getString("restaurant_name"),
                address = resultSet.getString("address"),
                phone = resultSet.getString("phone"),
                email = resultSet.getString("email"),
                taxId = resultSet.getString("tax_id"),
                logo = resultSet.getBytes("logo")
            )
        } else {
            logger.warn("Config not found")
            null
        }
    }

    suspend fun updateConfig(config: Config): Boolean {
        val statement = connection.prepareStatement(UPDATE_CONFIG)
        statement.setString(1, config.restaurantName)
        statement.setString(2, config.address)
        statement.setString(3, config.phone)
        statement.setString(4, config.email)
        statement.setString(5, config.taxId)
        statement.setBytes(6, config.logo)

        val rowsUpdated = statement.executeUpdate()
        if (rowsUpdated > 0) {
            logger.info("Config updated successfully")
        } else {
            logger.error("Failed to update config")
        }
        return rowsUpdated > 0
    }
}
