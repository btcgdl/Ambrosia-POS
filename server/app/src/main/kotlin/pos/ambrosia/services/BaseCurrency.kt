package pos.ambrosia.services

import java.sql.Connection
import pos.ambrosia.logger

class BaseCurrencyService(private val connection: Connection) {

    fun getBaseCurrency(): String {
        val query = "SELECT currency_id FROM base_currency WHERE id = 1"
        val statement = connection.prepareStatement(query)
        val resultSet = statement.executeQuery()
        return if (resultSet.next()) {
            resultSet.getString("currency_id")
        } else {
            logger.error("Base currency not found")
            "Unknown"
        }
    }
}
