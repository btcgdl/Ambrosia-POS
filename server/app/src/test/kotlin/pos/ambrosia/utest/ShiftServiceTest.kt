package pos.ambrosia.utest

import io.ktor.server.application.ApplicationEnvironment
import kotlinx.coroutines.runBlocking
import org.mockito.ArgumentMatchers.contains
import org.mockito.kotlin.*
import pos.ambrosia.models.Shift
import pos.ambrosia.services.ShiftService
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet
import kotlin.test.*

class ShiftServiceTest {
    private val mockConnection: Connection = mock()
    private val mockStatement: PreparedStatement = mock()
    private val mockResultSet: ResultSet = mock()
    private val mockEnv: ApplicationEnvironment = mock()

    @Test
    fun `getShifts returns list of shifts when found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false) // Arrange
            whenever(mockResultSet.getString("id")).thenReturn("shift-1").thenReturn("shift-2") // Arrange
            whenever(mockResultSet.getString("user_id")).thenReturn("user-1").thenReturn("user-2") // Arrange
            whenever(mockResultSet.getString("shift_date")).thenReturn("date-1").thenReturn("date-2") // Arrange
            whenever(mockResultSet.getString("start_time")).thenReturn("7am").thenReturn("2pm") // Arrange
            whenever(mockResultSet.getString("end_time")).thenReturn("2pm").thenReturn("9pm") // Arrange
            whenever(mockResultSet.getString("notes")).thenReturn("note-1").thenReturn("note-2") // Arrange
            val service = ShiftService(mockConnection) // Arrange
            val result = service.getShifts() // Act
            assertEquals(2, result.size) // Assert
            assertEquals("shift-1", result[0].id) // Assert
        }       
    }

    @Test
    fun `getShifts returns empty list when not found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(false) // Arrange
            val service = ShiftService(mockConnection) // Arrange
            val result = service.getShifts() // Act
            assertTrue(result.isEmpty()) // Assert
        }
    }

    @Test
    fun `getShiftById returns shift when found`() {
        runBlocking {
            val expectedShift = Shift(id = "shift-1", user_id = "user-1", shift_date = "date-1", start_time = "7am", end_time = "2pm", notes = "note1") // Arrange
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true) // Arrange
            whenever(mockResultSet.getString("id")).thenReturn(expectedShift.id) // Arrange
            whenever(mockResultSet.getString("user_id")).thenReturn(expectedShift.user_id) // Arrange
            whenever(mockResultSet.getString("shift_date")).thenReturn(expectedShift.shift_date) // Arrange
            whenever(mockResultSet.getString("start_time")).thenReturn(expectedShift.start_time) // Arrange
            whenever(mockResultSet.getString("end_time")).thenReturn(expectedShift.end_time) // Arrange
            whenever(mockResultSet.getString("notes")).thenReturn(expectedShift.notes) // Arrange
            val service = ShiftService(mockConnection) // Arrange
            val result = service.getShiftById("shift-1") // Act
            assertNotNull(result) // Assert
            assertEquals(expectedShift, result) // Assert
        }
    }

    @Test
    fun `getShiftById returns null when not found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(false) // Arrange
            val service = ShiftService(mockConnection) // Arrange
            val result = service.getShiftById("not-found") // Act
            assertNull(result) // Assert
        }
    }
}