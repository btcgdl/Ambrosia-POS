package pos.ambrosia.utest

import kotlinx.coroutines.runBlocking
import org.mockito.kotlin.*
import pos.ambrosia.models.Config
import pos.ambrosia.services.ConfigService
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet
import kotlin.test.*

class ConfigServiceTest {
    private val mockConnection: Connection = mock()
    private val mockStatement: PreparedStatement = mock()
    private val mockResultSet: ResultSet = mock()

    // Helper function to set up all the mock behavior for a successful `getConfig` call.
    private fun setupGetConfigMock(config: Config) {
        whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement)
        whenever(mockStatement.executeQuery()).thenReturn(mockResultSet)
        whenever(mockResultSet.next()).thenReturn(true)
        whenever(mockResultSet.getInt("id")).thenReturn(config.id)
        whenever(mockResultSet.getString("restaurant_name")).thenReturn(config.restaurantName)
        whenever(mockResultSet.getString("address")).thenReturn(config.address)
        whenever(mockResultSet.getString("phone")).thenReturn(config.phone)
        whenever(mockResultSet.getString("email")).thenReturn(config.email)
        whenever(mockResultSet.getString("tax_id")).thenReturn(config.taxId)
        whenever(mockResultSet.getBytes("logo")).thenReturn(config.logo)
    }

    // Helper function to set up mock behavior for when `getConfig` finds no data.
    private fun setupGetConfigToReturnNull() {
        whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement)
        whenever(mockStatement.executeQuery()).thenReturn(mockResultSet)
        whenever(mockResultSet.next()).thenReturn(false)
    }

    @Test
    fun `getConfig returns config when found`() = runBlocking {
        val expectedConfig = Config(1, "Test Cafe", "123 Lane", "555", "a@b.com", "T123", byteArrayOf()) // Arrange
        setupGetConfigMock(expectedConfig) // Arrange
        val service = ConfigService(mockConnection) // Arrange
        val result = service.getConfig() // Act
        assertEquals(expectedConfig, result) // Assert
    }

    @Test
    fun `getConfig returns null when not found`() = runBlocking {
        setupGetConfigToReturnNull() // Arrange
        val service = ConfigService(mockConnection) // Arrange
        val result = service.getConfig() // Act
        assertNull(result) // Assert
    }

    @Test
    fun `updateConfig returns true on success`() = runBlocking {
        val configToUpdate = Config(1, "New Name", "", "", "", "", byteArrayOf()) // Arrange
        whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
        whenever(mockStatement.executeUpdate()).thenReturn(1) // Arrange
        val service = ConfigService(mockConnection) // Arrange
        val result = service.updateConfig(configToUpdate) // Act
        assertTrue(result) // Assert
    }
}