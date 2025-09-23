package pos.ambrosia.utest

import kotlinx.coroutines.runBlocking
import org.mockito.kotlin.*
import pos.ambrosia.models.DishCategory
import pos.ambrosia.services.DishCategoryService
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet
import kotlin.test.*

class DishCategoryServiceTest {
    private val mockConnection: Connection = mock()
    private val mockStatement: PreparedStatement = mock()
    private val mockResultSet: ResultSet = mock()

    @Test
    fun `getDishCategories returns list of categories when found`() = runBlocking {
        whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
        whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
        whenever(mockResultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false) // Simulate a result set with two rows
        whenever(mockResultSet.getString("id")).thenReturn("id-1").thenReturn("id-2") // Define the data for the two rows
        whenever(mockResultSet.getString("name")).thenReturn("Appetizers").thenReturn("Main Courses") // Define the data for the two rows
        val service = DishCategoryService(mockConnection) // Arrange
        val result = service.getDishCategories() // Act
        assertEquals(2, result.size) // Assert
        assertEquals("Appetizers", result[0].name) // Assert
        assertEquals("Main Courses", result[1].name) // Assert
    }

    @Test
    fun `getDishCategories returns empty list when none found`() = runBlocking {
        whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
        whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
        whenever(mockResultSet.next()).thenReturn(false) // Simulate a result set with zero rows
        val service = DishCategoryService(mockConnection) // Arrange
        val result = service.getDishCategories() // Act        
        assertTrue(result.isEmpty()) // Assert
    }

    @Test
    fun `getDishCategoryById returns the category with provided Id number`() = runBlocking {
        val expectedCategory = DishCategory(id = "cat-1", name = "Starters") // Arrange
        whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
        whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
        whenever(mockResultSet.next()).thenReturn(true) // Arrange
        whenever(mockResultSet.getString("id")).thenReturn(expectedCategory.id) // Arrange
        whenever(mockResultSet.getString("name")).thenReturn(expectedCategory.name) // Arrange
        val service = DishCategoryService(mockConnection) // Arrange
        val result = service.getDishCategoryById("cat-1") // Act
        assertNotNull(result) // Assert
        assertEquals(expectedCategory, result) // Assert
    }

    @Test
    fun `getDishCategoryById returns null when not found`() = runBlocking {
        whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
        whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
        whenever(mockResultSet.next()).thenReturn(false) // Arrange
        val service = DishCategoryService(mockConnection) // Arrange
        val result = service.getDishCategoryById("not-found-id") // Act
        assertNull(result) // Assert
    }

    @Test
    fun `addDishCategory is blank and returns null` () = runBlocking {
        val blankCategory = DishCategory(id=null, name="") // Arrange
        val service = DishCategoryService(mockConnection) // Arrange
        val result = service.addDishCategory(blankCategory) // Act
        assertNull(result) // Assert
    }

}