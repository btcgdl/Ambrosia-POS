package pos.ambrosia.utest

import kotlinx.coroutines.runBlocking
import org.mockito.kotlin.*
import pos.ambrosia.models.TicketPayment
import pos.ambrosia.services.TicketPaymentService
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet
import kotlin.test.*

class TicketPaymentServiceTest {
    private val mockConnection: Connection = mock()
    private val mockStatement: PreparedStatement = mock()
    private val mockResultSet: ResultSet = mock()

    @Test
    fun `getTicketPaymentsByTicket returns list of payments when found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false) // Arrange
            whenever(mockResultSet.getString("payment_id")).thenReturn("pay-1").thenReturn("pay-2") // Arrange
            whenever(mockResultSet.getString("ticket_id")).thenReturn("ticket-1").thenReturn("ticket-1") // Arrange
            val service = TicketPaymentService(mockConnection) // Arrange
            val result = service.getTicketPaymentsByTicket("ticket-1") // Act
            assertEquals(2, result.size) // Assert
            assertEquals("pay-1", result[0].payment_id) // Assert
        }
    }

    @Test
    fun `getTicketPaymentsByTicket returns empty list when none found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(false) // Arrange
            val service = TicketPaymentService(mockConnection) // Arrange
            val result = service.getTicketPaymentsByTicket("ticket-2") // Act
            assertTrue(result.isEmpty()) // Assert
        }
    }

    @Test
    fun `getTicketPaymentsByPayment returns list of tickets when found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false) // Arrange
            whenever(mockResultSet.getString("payment_id")).thenReturn("pay-1").thenReturn("pay-1") // Arrange
            whenever(mockResultSet.getString("ticket_id")).thenReturn("ticket-1").thenReturn("ticket-2") // Arrange
            val service = TicketPaymentService(mockConnection) // Arrange
            val result = service.getTicketPaymentsByPayment("pay-1") // Act
            assertEquals(2, result.size) // Assert
            assertEquals("ticket-1", result[0].ticket_id) // Assert
        }
    }

    @Test
    fun `getTicketPaymentsByPayment returns empty list when none found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(false) // Arrange
            val service = TicketPaymentService(mockConnection) // Arrange
            val result = service.getTicketPaymentsByPayment("pay-2") // Act
            assertTrue(result.isEmpty()) // Assert
        }
    }

    @Test
    fun `addTicketPayment returns false if payment_id is blank`() {
        runBlocking {
            val ticketPayment = TicketPayment(payment_id = "", ticket_id = "ticket-1") // Arrange
            val service = TicketPaymentService(mockConnection) // Arrange
            val result = service.addTicketPayment(ticketPayment) // Act
            assertFalse(result) // Assert
            verify(mockConnection, never()).prepareStatement(any()) // Assert
        }
    }

    @Test
    fun `addTicketPayment returns false if ticket_id is blank`() {
        runBlocking {
            val ticketPayment = TicketPayment(payment_id = "pay-1", ticket_id = "") // Arrange
            val service = TicketPaymentService(mockConnection) // Arrange
            val result = service.addTicketPayment(ticketPayment) // Act
            assertFalse(result) // Assert
            verify(mockConnection, never()).prepareStatement(any()) // Assert
        }
    }
}