package pos.ambrosia.utest

import kotlinx.coroutines.runBlocking
import kotlin.test.Test
import org.mockito.kotlin.*
import pos.ambrosia.models.Config
import pos.ambrosia.services.ConfigService
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue
import kotlinx.coroutines.runBlocking

import org.junit.runner.RunWith
import org.junit.runners.JUnit4

@RunWith(JUnit4::class)
class ConfigServiceTest {

    private val mockConnection: Connection = mock()
    private val mockStatement: PreparedStatement = mock()
    private val mockResultSet: ResultSet = mock()


    @Test
    fun `getConfig should return Config object when result set is not empty`() {
        runBlocking {
            // Arrange
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement)
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet)
            whenever(mockResultSet.next()).thenReturn(true)
            whenever(mockResultSet.getInt("id")).thenReturn(1)
            whenever(mockResultSet.getString("restaurant_name")).thenReturn("Test Cafe")
            whenever(mockResultSet.getString("address")).thenReturn("123 Test Lane")
            whenever(mockResultSet.getString("phone")).thenReturn("123-456-7890")
            whenever(mockResultSet.getString("email")).thenReturn("test@example.com")
            whenever(mockResultSet.getString("tax_id")).thenReturn("TAX123")
            whenever(mockResultSet.getBytes("logo")).thenReturn(byteArrayOf())

            val configService = ConfigService(mockConnection)

            // Act
            val result = configService.getConfig()

            // Assert
            assertNotNull(result)
            assertEquals(1, result.id)
            assertEquals("Test Cafe", result.restaurantName)
            verify(mockConnection).prepareStatement(any())
        }
    }

    @Test
    fun `getConfig should return null when result set is empty`() {
        runBlocking {
            // Arrange
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement)
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet)
            whenever(mockResultSet.next()).thenReturn(false)

            val configService = ConfigService(mockConnection)

            // Act
            val result = configService.getConfig()

            // Assert
            assertNull(result)
        }
    }

    @Test
    fun `updateConfig should return true on successful update`() {
        runBlocking {
            // Arrange
            val configToUpdate = Config(1, "New Name", "New Address", "New Phone", "New Email", "New TaxID", byteArrayOf())
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement)
            whenever(mockStatement.executeUpdate()).thenReturn(1)

            val configService = ConfigService(mockConnection)

            // Act
            val result = configService.updateConfig(configToUpdate)

            // Assert
            assertTrue(result)
            verify(mockStatement).setString(1, configToUpdate.restaurantName)
            verify(mockStatement).setString(2, configToUpdate.address)
            verify(mockStatement).setString(3, configToUpdate.phone)
            verify(mockStatement).setString(4, configToUpdate.email)
            verify(mockStatement).setString(5, configToUpdate.taxId)
            verify(mockStatement).setBytes(6, configToUpdate.logo)
        }
    }
}