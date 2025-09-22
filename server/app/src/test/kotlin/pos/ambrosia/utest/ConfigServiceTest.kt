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

    /**
     * Helper function to set up all the mock behavior for a successful `getConfig` call.
     */
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

    /**
     * Helper function to set up mock behavior for when `getConfig` finds no data.
     */
    private fun setupGetConfigToReturnNull() {
        whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement)
        whenever(mockStatement.executeQuery()).thenReturn(mockResultSet)
        whenever(mockResultSet.next()).thenReturn(false)
    }

    @Test
    fun `getConfig returns config when found`() = runBlocking {
        // Arrange
        val expectedConfig = Config(1, "Test Cafe", "123 Lane", "555", "a@b.com", "T123", byteArrayOf())
        setupGetConfigMock(expectedConfig)
        val service = ConfigService(mockConnection)

        // Act
        val result = service.getConfig()

        assertEquals(expectedConfig, result)
    }

    @Test
    fun `getConfig returns null when not found`() = runBlocking {
        // Arrange
        setupGetConfigToReturnNull()
        val service = ConfigService(mockConnection)

        // Act
        val result = service.getConfig()

        assertNull(result)
    }

    @Test
    fun `updateConfig returns true on success`() = runBlocking {
        // Arrange
        val configToUpdate = Config(1, "New Name", "", "", "", "", byteArrayOf())
        whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement)
        whenever(mockStatement.executeUpdate()).thenReturn(1)
        val service = ConfigService(mockConnection)

        // Act
        val result = service.updateConfig(configToUpdate)

        assertTrue(result)
    }
}