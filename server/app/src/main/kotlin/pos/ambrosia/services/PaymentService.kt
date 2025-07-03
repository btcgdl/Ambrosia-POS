package pos.ambrosia.services

import java.sql.Connection
import pos.ambrosia.models.Payment

class PaymentService(private val connection: Connection) {
    companion object {
        private const val ADD_PAYMENT = "INSERT INTO payments (id, currency, name) VALUES (?, ?, ?)"
        private const val GET_PAYMENTS = "SELECT id, currency, name FROM payments"
        private const val GET_PAYMENT_BY_ID = "SELECT id, currency, name FROM payments WHERE id = ?"
        private const val UPDATE_PAYMENT = "UPDATE payments SET currency = ?, name = ? WHERE id = ?"
        private const val DELETE_PAYMENT = "DELETE FROM payments WHERE id = ?"
    }

    fun addPayment(payment: Payment): Boolean {
        val statement = connection.prepareStatement(ADD_PAYMENT)
        statement.setString(1, payment.id)
        statement.setString(2, payment.currency)
        statement.setString(3, payment.name)
        return statement.executeUpdate() > 0
    }

    fun getPayments(): List<Payment> {
        val statement = connection.prepareStatement(GET_PAYMENTS)
        val resultSet = statement.executeQuery()
        val payments = mutableListOf<Payment>()
        while (resultSet.next()) {
            val payment =
                    Payment(
                            id = resultSet.getString("id"),
                            currency = resultSet.getString("currency"),
                            name = resultSet.getString("name")
                    )
            payments.add(payment)
        }
        return payments
    }

    fun getPaymentById(id: String): Payment? {
        val statement = connection.prepareStatement(GET_PAYMENT_BY_ID)
        statement.setString(1, id)
        val resultSet = statement.executeQuery()
        return if (resultSet.next()) {
            Payment(
                    id = resultSet.getString("id"),
                    currency = resultSet.getString("currency"),
                    name = resultSet.getString("name")
            )
        } else null
    }

    fun updatePayment(payment: Payment): Boolean {
        val statement = connection.prepareStatement(UPDATE_PAYMENT)
        statement.setString(1, payment.currency)
        statement.setString(2, payment.name)
        statement.setString(3, payment.id)
        return statement.executeUpdate() > 0
    }

    fun deletePayment(id: String): Boolean {
        val statement = connection.prepareStatement(DELETE_PAYMENT)
        statement.setString(1, id)
        return statement.executeUpdate() > 0
    }
}
