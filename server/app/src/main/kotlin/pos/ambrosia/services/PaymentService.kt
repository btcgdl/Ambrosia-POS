package pos.ambrosia.services

import java.sql.Connection
import pos.ambrosia.logger
import pos.ambrosia.models.Payment
import pos.ambrosia.models.PaymentMethod

class PaymentService(private val connection: Connection) {
    companion object {
        // Payment queries
        private const val ADD_PAYMENT = "INSERT INTO payments (id, method_id, currency, name) VALUES (?, ?, ?, ?)"
        private const val GET_PAYMENTS = "SELECT id, method_id, currency, name FROM payments"
        private const val GET_PAYMENT_BY_ID = "SELECT id, method_id, currency, name FROM payments WHERE id = ?"
        private const val UPDATE_PAYMENT = "UPDATE payments SET method_id = ?, currency = ?, name = ? WHERE id = ?"
        private const val DELETE_PAYMENT = "DELETE FROM payments WHERE id = ?"
        private const val CHECK_PAYMENT_NAME_EXISTS = "SELECT id FROM payments WHERE name = ?"
        private const val CHECK_PAYMENT_IN_USE =
                "SELECT COUNT(*) as count FROM payments_tickets WHERE payment_method = ?"
        
        // Payment method queries
        private const val GET_PAYMENT_METHODS = "SELECT id, name FROM payment_methods"
        private const val GET_PAYMENT_METHOD_BY_ID = "SELECT id, name FROM payment_methods WHERE id = ?"
        private const val CHECK_PAYMENT_METHOD_EXISTS = "SELECT id FROM payment_methods WHERE id = ?"
    }

    private fun paymentNameExists(paymentName: String): Boolean {
        val statement = connection.prepareStatement(CHECK_PAYMENT_NAME_EXISTS)
        statement.setString(1, paymentName)
        val resultSet = statement.executeQuery()
        return resultSet.next()
    }

    private fun paymentNameExistsExcludingId(paymentName: String, excludeId: String): Boolean {
        val statement =
                connection.prepareStatement("SELECT id FROM payments WHERE name = ? AND id != ?")
        statement.setString(1, paymentName)
        statement.setString(2, excludeId)
        val resultSet = statement.executeQuery()
        return resultSet.next()
    }

    private fun paymentInUse(paymentId: String): Boolean {
        val statement = connection.prepareStatement(CHECK_PAYMENT_IN_USE)
        statement.setString(1, paymentId)
        val resultSet = statement.executeQuery()
        if (resultSet.next()) {
            return resultSet.getInt("count") > 0
        }
        return false
    }

    private fun paymentMethodExists(methodId: String): Boolean {
        val statement = connection.prepareStatement(CHECK_PAYMENT_METHOD_EXISTS)
        statement.setString(1, methodId)
        val resultSet = statement.executeQuery()
        return resultSet.next()
    }

    // Payment Methods operations
    suspend fun getPaymentMethods(): List<PaymentMethod> {
        val statement = connection.prepareStatement(GET_PAYMENT_METHODS)
        val resultSet = statement.executeQuery()
        val paymentMethods = mutableListOf<PaymentMethod>()
        while (resultSet.next()) {
            val paymentMethod = PaymentMethod(
                id = resultSet.getString("id"),
                name = resultSet.getString("name")
            )
            paymentMethods.add(paymentMethod)
        }
        logger.info("Retrieved ${paymentMethods.size} payment methods")
        return paymentMethods
    }

    suspend fun getPaymentMethodById(id: String): PaymentMethod? {
        val statement = connection.prepareStatement(GET_PAYMENT_METHOD_BY_ID)
        statement.setString(1, id)
        val resultSet = statement.executeQuery()
        return if (resultSet.next()) {
            PaymentMethod(
                id = resultSet.getString("id"),
                name = resultSet.getString("name")
            )
        } else {
            logger.warn("Payment method not found with ID: $id")
            null
        }
    }

    suspend fun addPayment(payment: Payment): String? {
        // Validar que los campos requeridos no estén vacíos
        if (payment.method_id.isBlank() || payment.currency.isBlank() || payment.name.isBlank()) {
            logger.error("Method ID, currency and name are required fields")
            return null
        }

        // Verificar que el method_id exista en payment_methods
        if (!paymentMethodExists(payment.method_id)) {
            logger.error("Payment method ID does not exist: ${payment.method_id}")
            return null
        }

        // Verificar que el nombre del método de pago no exista ya
        if (paymentNameExists(payment.name)) {
            logger.error("Payment method name already exists: ${payment.name}")
            return null
        }

        val generatedId = java.util.UUID.randomUUID().toString()
        val statement = connection.prepareStatement(ADD_PAYMENT)

        statement.setString(1, generatedId)
        statement.setString(2, payment.method_id)
        statement.setString(3, payment.currency)
        statement.setString(4, payment.name)

        val rowsAffected = statement.executeUpdate()

        return if (rowsAffected > 0) {
            logger.info("Payment created successfully with ID: $generatedId")
            generatedId
        } else {
            logger.error("Failed to create payment")
            null
        }
    }

    suspend fun getPayments(): List<Payment> {
        val statement = connection.prepareStatement(GET_PAYMENTS)
        val resultSet = statement.executeQuery()
        val payments = mutableListOf<Payment>()
        while (resultSet.next()) {
            val payment =
                    Payment(
                            id = resultSet.getString("id"),
                            method_id = resultSet.getString("method_id"),
                            currency = resultSet.getString("currency"),
                            name = resultSet.getString("name")
                    )
            payments.add(payment)
        }
        logger.info("Retrieved ${payments.size} payments")
        return payments
    }

    suspend fun getPaymentById(id: String): Payment? {
        val statement = connection.prepareStatement(GET_PAYMENT_BY_ID)
        statement.setString(1, id)
        val resultSet = statement.executeQuery()
        return if (resultSet.next()) {
            Payment(
                    id = resultSet.getString("id"),
                    method_id = resultSet.getString("method_id"),
                    currency = resultSet.getString("currency"),
                    name = resultSet.getString("name")
            )
        } else {
            logger.warn("Payment not found with ID: $id")
            null
        }
    }

    suspend fun updatePayment(payment: Payment): Boolean {
        if (payment.id == null) {
            logger.error("Cannot update payment: ID is null")
            return false
        }

        // Validar que los campos requeridos no estén vacíos
        if (payment.method_id.isBlank() || payment.currency.isBlank() || payment.name.isBlank()) {
            logger.error("Method ID, currency and name are required fields")
            return false
        }

        // Verificar que el method_id exista en payment_methods
        if (!paymentMethodExists(payment.method_id)) {
            logger.error("Payment method ID does not exist: ${payment.method_id}")
            return false
        }

        // Verificar que el nombre del método de pago no exista ya (excluyendo el método actual)
        if (paymentNameExistsExcludingId(payment.name, payment.id)) {
            logger.error("Payment name already exists: ${payment.name}")
            return false
        }

        val statement = connection.prepareStatement(UPDATE_PAYMENT)
        statement.setString(1, payment.method_id)
        statement.setString(2, payment.currency)
        statement.setString(3, payment.name)
        statement.setString(4, payment.id)

        val rowsUpdated = statement.executeUpdate()
        if (rowsUpdated > 0) {
            logger.info("Payment updated successfully: ${payment.id}")
        } else {
            logger.error("Failed to update payment: ${payment.id}")
        }
        return rowsUpdated > 0
    }

    suspend fun deletePayment(id: String): Boolean {
        // Verificar que el payment no esté siendo usado
        if (paymentInUse(id)) {
            logger.error("Cannot delete payment $id: it's being used in transactions")
            return false
        }

        val statement = connection.prepareStatement(DELETE_PAYMENT)
        statement.setString(1, id)
        val rowsDeleted = statement.executeUpdate()

        if (rowsDeleted > 0) {
            logger.info("Payment deleted successfully: $id")
        } else {
            logger.error("Failed to delete payment: $id")
        }
        return rowsDeleted > 0
    }
}
