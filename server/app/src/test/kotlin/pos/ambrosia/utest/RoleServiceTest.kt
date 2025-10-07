package pos.ambrosia.utest

import io.ktor.server.application.ApplicationEnvironment
import kotlinx.coroutines.runBlocking
import org.mockito.ArgumentMatchers.contains
import org.mockito.kotlin.*
import pos.ambrosia.models.Role
import pos.ambrosia.services.RolesService
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet
import kotlin.test.*

class RoleServiceTest {
    private val mockConnection: Connection = mock()
    private val mockStatement: PreparedStatement = mock()
    private val mockResultSet: ResultSet = mock()
    private val mockEnv: ApplicationEnvironment = mock()

    @Test
    fun `getRoles returns list of roles when found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false) // Arrange
            whenever(mockResultSet.getString("id")).thenReturn("role-1").thenReturn("role-2") // Arrange
            whenever(mockResultSet.getString("role")).thenReturn("Admin").thenReturn("Cashier") // Arrange
            whenever(mockResultSet.getString("password")).thenReturn("pass-hash-1").thenReturn("pass-hash-2") // Arrange
            whenever(mockResultSet.getBoolean("isAdmin")).thenReturn(true).thenReturn(false) // Arrange
            val service = RolesService(mockEnv, mockConnection) // Arrange
            val result = service.getRoles() // Act
            assertEquals(2, result.size) // Assert
            assertEquals("Admin", result[0].role) // Assert
            assertFalse(result[1].isAdmin ?: true) // Assert
        }
    }

    @Test
    fun `getRoles returns empty list when none found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(false) // Arrange
            val service = RolesService(mockEnv, mockConnection) // Arrange
            val result = service.getRoles() // Act
            assertTrue(result.isEmpty()) // Assert
        }
    }

    @Test
    fun `getRoleById returns role when found`() {
        runBlocking {
            val expectedRole = Role(id = "role-1", role = "Admin", password = "pass-hash-1", isAdmin = true) // Arrange
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true) // Arrange
            whenever(mockResultSet.getString("id")).thenReturn(expectedRole.id) // Arrange
            whenever(mockResultSet.getString("role")).thenReturn(expectedRole.role) // Arrange
            whenever(mockResultSet.getString("password")).thenReturn(expectedRole.password) // Arrange
            whenever(mockResultSet.getBoolean("isAdmin")).thenReturn(expectedRole.isAdmin) // Arrange
            val service = RolesService(mockEnv, mockConnection) // Arrange
            val result = service.getRoleById("role-1") // Act
            assertNotNull(result) // Assert
            assertEquals(expectedRole, result) // Assert
        }
    }

    @Test
    fun `getRoleById returns null when not found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(false) // Arrange
            val service = RolesService(mockEnv, mockConnection) // Arrange
            val result = service.getRoleById("not-found") // Act
            assertNull(result) // Assert
        }
    }

    @Test
    fun `deleteRole returns false if role is in use`() {
        runBlocking {
            val roleId = "role-1" // Arrange
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true) // Arrange
            whenever(mockResultSet.getInt("count")).thenReturn(1) // Arrange: Simulate role is in use
            val service = RolesService(mockEnv, mockConnection) // Arrange
            val result = service.deleteRole(roleId) // Act
            assertFalse(result) // Assert
            verify(mockConnection, never()).prepareStatement(contains("UPDATE roles SET is_deleted")) // Assert
        }
    }

    @Test
    fun `deleteRole returns true on success`() {
        runBlocking {
            val roleId = "role-1" // Arrange
            val checkInUseStatement: PreparedStatement = mock() // Arrange
            val deleteStatement: PreparedStatement = mock() // Arrange
            whenever(mockConnection.prepareStatement(contains("SELECT COUNT(*)"))).thenReturn(checkInUseStatement) // Arrange
            whenever(mockConnection.prepareStatement(contains("UPDATE roles SET is_deleted"))).thenReturn(deleteStatement) // Arrange
            val checkInUseResultSet: ResultSet = mock() // Arrange
            whenever(checkInUseResultSet.next()).thenReturn(true) // Arrange
            whenever(checkInUseResultSet.getInt("count")).thenReturn(0) // Arrange
            whenever(checkInUseStatement.executeQuery()).thenReturn(checkInUseResultSet) // Arrange
            whenever(deleteStatement.executeUpdate()).thenReturn(1) // Arrange
            val service = RolesService(mockEnv, mockConnection) // Arrange
            val result = service.deleteRole(roleId) // Act
            assertTrue(result) // Assert
        }
    }

    @Test
    fun `deleteRole returns false when role not found`() {
        runBlocking {
            val roleId = "not-found-role" // Arrange
            val checkInUseStatement: PreparedStatement = mock() // Arrange
            val deleteStatement: PreparedStatement = mock() // Arrange
            whenever(mockConnection.prepareStatement(contains("SELECT COUNT(*)"))).thenReturn(checkInUseStatement) // Arrange
            whenever(mockConnection.prepareStatement(contains("UPDATE roles SET is_deleted"))).thenReturn(deleteStatement) // Arrange
            val checkInUseResultSet: ResultSet = mock() // Arrange
            whenever(checkInUseResultSet.next()).thenReturn(true) // Arrange
            whenever(checkInUseResultSet.getInt("count")).thenReturn(0) // Arrange
            whenever(checkInUseStatement.executeQuery()).thenReturn(checkInUseResultSet) // Arrange
            whenever(deleteStatement.executeUpdate()).thenReturn(0) // Arrange
            val service = RolesService(mockEnv, mockConnection) // Arrange
            val result = service.deleteRole(roleId) // Act
            assertFalse(result) // Assert
        }
    }
}