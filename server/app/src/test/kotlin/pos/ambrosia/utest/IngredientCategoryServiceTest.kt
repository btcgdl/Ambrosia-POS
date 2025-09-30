package pos.ambrosia.utest

import kotlinx.coroutines.runBlocking
import org.mockito.kotlin.*
import pos.ambrosia.models.IngredientCategory
import pos.ambrosia.services.IngredientCategoryService
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet
import kotlin.test.*

class IngredientCategoryServiceTest {
    private val mockConnection: Connection = mock()
    private val mockStatement: PreparedStatement = mock()
    private val mockResultSet: ResultSet = mock()

    @Test
    fun `getIngredientCategories returns list of categories when found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false) // Arrange
            whenever(mockResultSet.getString("id")).thenReturn("ing-cat-1").thenReturn("ing-cat-2") // Arrange
            whenever(mockResultSet.getString("name")).thenReturn("Vegetables").thenReturn("Meats") // Arrange
            val service = IngredientCategoryService(mockConnection) // Arrange
            val result = service.getIngredientCategories() // Act
            assertEquals(2, result.size) // Assert
            assertEquals("Vegetables", result[0].name) // Assert
            assertEquals("Meats", result[1].name) // Assert
        }
    }

    @Test
    fun `getIngredientCategories returns empty list when none found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(false) // Arrange
            val service = IngredientCategoryService(mockConnection) // Arrange
            val result = service.getIngredientCategories() // Act
            assertTrue(result.isEmpty()) // Assert
        }
    }

    @Test
    fun `getIngredientCategorybyId returns the category with provided Id number`() {
        runBlocking {
            val expectedCategory = IngredientCategory(id = "cat-1", name = "Starters") // Arrange
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true) // Arrange
            whenever(mockResultSet.getString("id")).thenReturn(expectedCategory.id) // Arrange
            whenever(mockResultSet.getString("name")).thenReturn(expectedCategory.name) // Arrange
            val service = IngredientCategoryService(mockConnection) // Arrange
            val result = service.getIngredientCategoryById("cat-1") // Act
            assertNotNull(result) // Assert
            assertEquals(expectedCategory, result) // Arrange
        }
    }

    @Test
    fun `getIngredientCategorybyId returns null when not found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(false) // Arrange
            val service = IngredientCategoryService(mockConnection) // Arrange
            val result = service.getIngredientCategoryById("not-found-id") // Act
            assertNull(result) // Assert
        }
    }
}