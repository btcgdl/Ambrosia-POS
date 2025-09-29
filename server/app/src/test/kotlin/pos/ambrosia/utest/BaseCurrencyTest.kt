package pos.ambrosia.utest

import org.mockito.kotlin.*
import pos.ambrosia.services.BaseCurrencyService
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet
import kotlin.test.*

class BaseCurrencyTest {
    private val mockConnection: Connection = mock()
    private val mockStatement: PreparedStatement = mock()
    private val mockResultSet: ResultSet = mock()

    @Test
    fun `getBaseCurrency returns currency ID when found`() {
        val expectedCurrency = "USD" // Arrange
        whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
        whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
        whenever(mockResultSet.next()).thenReturn(true) // Arrange
        whenever(mockResultSet.getString("currency_id")).thenReturn(expectedCurrency) // Arrange
        val service = BaseCurrencyService(mockConnection) // Arrange
        val result = service.getBaseCurrency()  // Act
        assertEquals(expectedCurrency, result) // Assert
    }

    @Test
    fun `getBaseCurrency returns Unknown when not found`() {
        whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
        whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
        whenever(mockResultSet.next()).thenReturn(false) // Simulate not finding the currency
        val service = BaseCurrencyService(mockConnection) // Arrange
        val result = service.getBaseCurrency() // Act
        assertEquals("Unknown", result) // Assert
    }
}