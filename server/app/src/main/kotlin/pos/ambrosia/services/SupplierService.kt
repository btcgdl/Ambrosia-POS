package pos.ambrosia.services

import java.sql.Connection
import pos.ambrosia.models.Supplier

class SupplierService(private val connection: Connection) {
    companion object {
        private const val ADD_SUPPLIER =
                "INSERT INTO suppliers (id, name, contact, phone, email, address) VALUES (?, ?, ?, ?, ?, ?)"
        private const val GET_SUPPLIERS =
                "SELECT id, name, contact, phone, email, address FROM suppliers WHERE is_deleted = 0"
        private const val GET_SUPPLIER_BY_ID =
                "SELECT id, name, contact, phone, email, address FROM suppliers WHERE id = ? AND is_deleted = 0"
        private const val UPDATE_SUPPLIER =
                "UPDATE suppliers SET name = ?, contact = ?, phone = ?, email = ?, address = ? WHERE id = ?"
        private const val DELETE_SUPPLIER = "UPDATE suppliers SET is_deleted = 1 WHERE id = ?"
    }

    fun addSupplier(supplier: Supplier): Boolean {
        val statement = connection.prepareStatement(ADD_SUPPLIER)
        statement.setString(1, supplier.id)
        statement.setString(2, supplier.name)
        statement.setString(3, supplier.contact)
        statement.setString(4, supplier.phone)
        statement.setString(5, supplier.email)
        statement.setString(6, supplier.address)
        return statement.executeUpdate() > 0
    }

    fun getSuppliers(): List<Supplier> {
        val statement = connection.prepareStatement(GET_SUPPLIERS)
        val resultSet = statement.executeQuery()
        val suppliers = mutableListOf<Supplier>()
        while (resultSet.next()) {
            val supplier =
                    Supplier(
                            id = resultSet.getString("id"),
                            name = resultSet.getString("name"),
                            contact = resultSet.getString("contact"),
                            phone = resultSet.getString("phone"),
                            email = resultSet.getString("email"),
                            address = resultSet.getString("address")
                    )
            suppliers.add(supplier)
        }
        return suppliers
    }

    fun getSupplierById(id: String): Supplier? {
        val statement = connection.prepareStatement(GET_SUPPLIER_BY_ID)
        statement.setString(1, id)
        val resultSet = statement.executeQuery()
        return if (resultSet.next()) {
            Supplier(
                    id = resultSet.getString("id"),
                    name = resultSet.getString("name"),
                    contact = resultSet.getString("contact"),
                    phone = resultSet.getString("phone"),
                    email = resultSet.getString("email"),
                    address = resultSet.getString("address")
            )
        } else {
            null
        }
    }

    fun updateSupplier(supplier: Supplier): Boolean {
        val statement = connection.prepareStatement(UPDATE_SUPPLIER)
        statement.setString(1, supplier.name)
        statement.setString(2, supplier.contact)
        statement.setString(3, supplier.phone)
        statement.setString(4, supplier.email)
        statement.setString(5, supplier.address)
        statement.setString(6, supplier.id)
        return statement.executeUpdate() > 0
    }

    fun deleteSupplier(id: String): Boolean {
        val statement = connection.prepareStatement(DELETE_SUPPLIER)
        statement.setString(1, id)
        return statement.executeUpdate() > 0
    }
}
