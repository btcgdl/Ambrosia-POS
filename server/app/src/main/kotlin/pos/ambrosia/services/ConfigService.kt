package pos.ambrosia.services

import java.sql.Connection
import pos.ambrosia.logger
import pos.ambrosia.models.Config

class ConfigService(private val connection: Connection) {
    companion object {
        private const val GET_CONFIG = "SELECT id, business_type, business_name, business_address, business_phone, business_email, business_tax_id, business_logo_url FROM config WHERE id = 1"
        private const val UPDATE_CONFIG = "INSERT OR REPLACE INTO config (id, business_type, business_name, business_address, business_phone, business_email, business_tax_id, business_logo_url) VALUES (1, ?, ?, ?, ?, ?, ?, ?)"
    }

    suspend fun getConfig(): Config? {
        val statement = connection.prepareStatement(GET_CONFIG)
        val resultSet = statement.executeQuery()
        return if (resultSet.next()) {
            Config(
                id = resultSet.getInt("id"),
                businessType = resultSet.getString("business_type"),
                businessName = resultSet.getString("business_name"),
                businessAddress = resultSet.getString("business_address"),
                businessPhone = resultSet.getString("business_phone"),
                businessEmail = resultSet.getString("business_email"),
                businessTaxId = resultSet.getString("business_tax_id"),
                businessLogoUrl = resultSet.getString("business_logo_url")
            )
        } else {
            logger.warn("Config not found")
            null
        }
    }

    suspend fun updateConfig(config: Config): Boolean {
        val statement = connection.prepareStatement(UPDATE_CONFIG)
        statement.setString(1, config.businessType)
        statement.setString(2, config.businessName)
        statement.setString(3, config.businessAddress)
        statement.setString(4, config.businessPhone)
        statement.setString(5, config.businessEmail)
        statement.setString(6, config.businessTaxId)
        statement.setString(7, config.businessLogoUrl)

        val rowsUpdated = statement.executeUpdate()
        if (rowsUpdated > 0) {
            logger.info("Config updated successfully")
        } else {
            logger.error("Failed to update config")
        }
        return rowsUpdated > 0
    }
}
