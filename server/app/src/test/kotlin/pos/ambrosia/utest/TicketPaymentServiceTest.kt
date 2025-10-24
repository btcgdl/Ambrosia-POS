package pos.ambrosia.utest

import kotlinx.coroutines.runBlocking
import org.mockito.ArgumentMatchers.contains
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

    @Test
    fun `addTicketPayment returns false if ticket_id does not exist`() {
        runBlocking {
            val ticketPayment = TicketPayment(payment_id = "pay-1", ticket_id = "non-existent-ticket") // Arrange
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(false) // Arrange
            val service = TicketPaymentService(mockConnection) // Arrange
            val result = service.addTicketPayment(ticketPayment) // Act
            assertFalse(result) // Assert
        }
    }

    @Test
    fun `addTicketPayment returns false if payment_id does not exist`() {
        runBlocking {
            val ticketPayment = TicketPayment(payment_id = "non-existent-pay", ticket_id = "ticket-1") // Arrange
            val ticketCheckStatement: PreparedStatement = mock() // Arrange
            val paymentCheckStatement: PreparedStatement = mock() // Arrange
            whenever(mockConnection.prepareStatement(contains("tickets"))).thenReturn(ticketCheckStatement) // Arrange
            whenever(mockConnection.prepareStatement(contains("payments"))).thenReturn(paymentCheckStatement) // Arrange
            val ticketResultSet: ResultSet = mock() // Arrange
            whenever(ticketResultSet.next()).thenReturn(true) // Arrange
            whenever(ticketCheckStatement.executeQuery()).thenReturn(ticketResultSet) // Arrange
            val paymentResultSet: ResultSet = mock() // Arrange
            whenever(paymentResultSet.next()).thenReturn(false) // Arrange
            whenever(paymentCheckStatement.executeQuery()).thenReturn(paymentResultSet) // Arrange
            val service = TicketPaymentService(mockConnection) // Arrange
            val result = service.addTicketPayment(ticketPayment) // Act
            assertFalse(result) // Assert
        }
    }

    @Test
    fun `addTicketPayment returns true on success`() {
        runBlocking {
            val ticketPayment = TicketPayment(payment_id = "pay-1", ticket_id = "ticket-1") // Arrange
            val ticketCheckStatement: PreparedStatement = mock() // Arrange
            val paymentCheckStatement: PreparedStatement = mock() // Arrange
            val addStatement: PreparedStatement = mock() // Arrange
            whenever(mockConnection.prepareStatement(contains("tickets"))).thenReturn(ticketCheckStatement) // Arrange
            whenever(mockConnection.prepareStatement(contains("payments"))).thenReturn(paymentCheckStatement) // Arrange
            whenever(mockConnection.prepareStatement(contains("INSERT INTO"))).thenReturn(addStatement) // Arrange
            val ticketResultSet: ResultSet = mock() // Arrange
            whenever(ticketResultSet.next()).thenReturn(true) // Arrange
            whenever(ticketCheckStatement.executeQuery()).thenReturn(ticketResultSet) // Arrange
            val paymentResultSet: ResultSet = mock() // Arrange
            whenever(paymentResultSet.next()).thenReturn(true) // Arrange
            whenever(paymentCheckStatement.executeQuery()).thenReturn(paymentResultSet) // Arrange
            whenever(addStatement.executeUpdate()).thenReturn(1) // Arrange
            val service = TicketPaymentService(mockConnection) // Arrange
            val result = service.addTicketPayment(ticketPayment) // Act
            assertTrue(result) // Assert
        }
    }

    @Test
    fun `addTicketPayment returns false when database insert fails`() {
        runBlocking {
            val ticketPayment = TicketPayment(payment_id = "pay-1", ticket_id = "ticket-1") // Arrange
            val ticketCheckStatement: PreparedStatement = mock() // Arrange
            val paymentCheckStatement: PreparedStatement = mock() // Arrange
            val addStatement: PreparedStatement = mock() // Arrange
            whenever(mockConnection.prepareStatement(contains("tickets"))).thenReturn(ticketCheckStatement) // Arrange
            whenever(mockConnection.prepareStatement(contains("payments"))).thenReturn(paymentCheckStatement) // Arrange
            whenever(mockConnection.prepareStatement(contains("INSERT INTO"))).thenReturn(addStatement) // Arrange
            val ticketResultSet: ResultSet = mock() // Arrange
            whenever(ticketResultSet.next()).thenReturn(true) // Arrange
            whenever(ticketCheckStatement.executeQuery()).thenReturn(ticketResultSet) // Arrange
            val paymentResultSet: ResultSet = mock() // Arrange
            whenever(paymentResultSet.next()).thenReturn(true) // Arrange
            whenever(paymentCheckStatement.executeQuery()).thenReturn(paymentResultSet) // Arrange
            whenever(addStatement.executeUpdate()).thenReturn(0) // Arrange
            val service = TicketPaymentService(mockConnection) // Arrange
            val result = service.addTicketPayment(ticketPayment) // Act
            assertFalse(result) // Assert
        }
    }

    @Test
    fun `deleteTicketPayment returns true on success`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeUpdate()).thenReturn(1) // Arrange
            val service = TicketPaymentService(mockConnection) // Arrange
            val result = service.deleteTicketPayment("pay-1", "ticket-1") // Act
            assertTrue(result) // Assert
        }
    }

    @Test
    fun `deleteTicketPayment returns false when record not found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeUpdate()).thenReturn(0) // Arrange
            val service = TicketPaymentService(mockConnection) // Arrange
            val result = service.deleteTicketPayment("pay-1", "not-found-ticket") // Act
            assertFalse(result) // Assert
        }
    }

    @Test
    fun `deleteTicketPaymentsByTicket returns true on success`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeUpdate()).thenReturn(3) // Arrange
            val service = TicketPaymentService(mockConnection) // Arrange
            val result = service.deleteTicketPaymentsByTicket("ticket-1") // Act
            assertTrue(result) // Assert
        }
    }
}