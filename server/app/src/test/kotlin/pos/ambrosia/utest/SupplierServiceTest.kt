package pos.ambrosia.utest

import kotlinx.coroutines.runBlocking
import org.mockito.kotlin.*
import pos.ambrosia.models.Supplier
import pos.ambrosia.services.SupplierService
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet
import kotlin.test.*

class SupplierServiceTest {
    private val mockConnection: Connection = mock()
    private val mockStatement: PreparedStatement = mock()
    private val mockResultSet: ResultSet = mock()

    @Test
    fun `getSuppliers returns list of suppliers when found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false) // Arrange
            whenever(mockResultSet.getString("id")).thenReturn("sup-1").thenReturn("sup-2") // Arrange
            whenever(mockResultSet.getString("name")).thenReturn("Sysco").thenReturn("US Foods") // Arrange
            whenever(mockResultSet.getString("contact")).thenReturn("John Doe").thenReturn("Jane Smith") // Arrange
            whenever(mockResultSet.getString("phone")).thenReturn("555-1111").thenReturn("555-2222") // Arrange
            whenever(mockResultSet.getString("email")).thenReturn("john@sysco.com").thenReturn("jane@usfoods.com") // Arrange
            whenever(mockResultSet.getString("address")).thenReturn("123 Supply St").thenReturn("456 Food Ave") // Arrange
            val service = SupplierService(mockConnection) // Arrange
            val result = service.getSuppliers() // Act
            assertEquals(2, result.size) // Assert
            assertEquals("Sysco", result[0].name) // Assert
        }
    }

    @Test
    fun `getSuppliers returns empty list when none found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(false) // Arrange
            val service = SupplierService(mockConnection) // Arrange
            val result = service.getSuppliers() // Act
            assertTrue(result.isEmpty()) // Assert
        }
    }

    @Test
    fun `getSupplierById returns supplier when found`() {
        runBlocking {
            val expectedSupplier = Supplier("sup-1", "Sysco", "John Doe", "555-1111", "john@sysco.com", "123 Supply St") // Arrange
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true) // Arrange
            whenever(mockResultSet.getString("id")).thenReturn(expectedSupplier.id) // Arrange
            whenever(mockResultSet.getString("name")).thenReturn(expectedSupplier.name) // Arrange
            whenever(mockResultSet.getString("contact")).thenReturn(expectedSupplier.contact) // Arrange
            whenever(mockResultSet.getString("phone")).thenReturn(expectedSupplier.phone) // Arrange
            whenever(mockResultSet.getString("email")).thenReturn(expectedSupplier.email) // Arrange
            whenever(mockResultSet.getString("address")).thenReturn(expectedSupplier.address) // Arrange
            val service = SupplierService(mockConnection) // Arrange
            val result = service.getSupplierById("sup-1") // Act
            assertNotNull(result) // Assert
            assertEquals(expectedSupplier, result) // Assert
        }
    }

    @Test
    fun `getSupplierById returns null when not found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(false) // Arrange
            val service = SupplierService(mockConnection) // Arrange
            val result = service.getSupplierById("not-found") // Act
            assertNull(result) // Assert
        }
    }
}