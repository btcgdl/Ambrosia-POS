package pos.ambrosia.utest

import kotlinx.coroutines.runBlocking
import org.mockito.kotlin.*
import pos.ambrosia.models.PaymentMethod
import pos.ambrosia.models.Currency
import pos.ambrosia.services.PaymentService
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet
import kotlin.test.*

class PaymentServiceTest {
    private val mockConnection: Connection = mock()
    private val mockStatement: PreparedStatement = mock()
    private val mockResultSet: ResultSet = mock()

    @Test
    fun `getPaymentMethods returns list of methods when found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false) // Arrange
            whenever(mockResultSet.getString("id")).thenReturn("pm-1").thenReturn("pm-2") // Arrange
            whenever(mockResultSet.getString("name")).thenReturn("Cash").thenReturn("Credit Card") // Arrange
            val service = PaymentService(mockConnection) // Arrange
            val result = service.getPaymentMethods() // Act
            assertEquals(2, result.size) // Assert
            assertEquals("Cash", result[0].name) // Assert
        }
    }

    @Test
    fun `getPaymentMethods returns empty list when none found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(false) // Arrange
            val service = PaymentService(mockConnection) // Arrange
            val result = service.getPaymentMethods() // Act
            assertTrue(result.isEmpty()) // Assert
        }
    }

    @Test
    fun `getPaymentMethodById returns method when found`() {
        runBlocking {
            val expectedMethod = PaymentMethod(id = "pm-1", name = "Cash") // Arrange
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true) // Arrange
            whenever(mockResultSet.getString("id")).thenReturn(expectedMethod.id) // Arrange
            whenever(mockResultSet.getString("name")).thenReturn(expectedMethod.name) // Arrange
            val service = PaymentService(mockConnection) // Arrange
            val result = service.getPaymentMethodById("pm-1") // Act
            assertNotNull(result) // Assert
            assertEquals(expectedMethod, result) // Assert
        }
    }

    @Test
    fun `getPaymentMethodById returns null when not found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(false) // Arrange
            val service = PaymentService(mockConnection) // Arrange
            val result = service.getPaymentMethodById("not-found") // Act
            assertNull(result) // Assert
        }
    }

    @Test
    fun `getCurrencies returns list of currencies when found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false) // Arrange
            whenever(mockResultSet.getString("id")).thenReturn("cur-1").thenReturn("cur-2") // Arrange
            whenever(mockResultSet.getString("acronym")).thenReturn("USD").thenReturn("EUR") // Arrange
            val service = PaymentService(mockConnection) // Arrange
            val result = service.getCurrencies() // Act
            assertEquals(2, result.size) // Assert
            assertEquals("USD", result[0].acronym) // Assert
        }
    }

    @Test
    fun `getCurrencies returns empty list when none found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(false) // Arrange
            val service = PaymentService(mockConnection) // Arrange
            val result = service.getCurrencies() // Act
            assertTrue(result.isEmpty()) // Assert
        }
    }

    @Test
    fun `getCurrencyById returns currency when found`() {
        runBlocking {
            val expectedCurrency = Currency(id = "cur-1", acronym = "USD") // Arrange
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true) // Arrange
            whenever(mockResultSet.getString("id")).thenReturn(expectedCurrency.id) // Arrange
            whenever(mockResultSet.getString("acronym")).thenReturn(expectedCurrency.acronym) // Arrange
            val service = PaymentService(mockConnection) // Arrange
            val result = service.getCurrencyById("cur-1") // Act
            assertNotNull(result) // Assert
            assertEquals(expectedCurrency, result) // Assert
        }
    }

    @Test
    fun `getCurrencyById returns null when not found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(false) // Arrange
            val service = PaymentService(mockConnection) // Arrange
            val result = service.getCurrencyById("not-found") // Act
            assertNull(result) // Assert
        }
    }
}