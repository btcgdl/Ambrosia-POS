package pos.ambrosia.utest

import kotlinx.coroutines.runBlocking
import org.mockito.ArgumentMatchers.contains
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
            assertEquals(expectedCategory, result) // Assert
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

    @Test
    fun `addIngredientCategory returns null if name is blank`() {
        runBlocking {
            val blankCategory = IngredientCategory(id = null, name = "") // Arrange
            val service = IngredientCategoryService(mockConnection) // Arrange
            val result = service.addIngredientCategory(blankCategory) // Act
            assertNull(result) // Assert
        }
    }

    @Test
    fun `addIngredientCategory returns null if name already exists`() {
        runBlocking {
            val existingCategory = IngredientCategory(id = null, name = "Existing Name") // Arrange
            whenever(mockConnection.prepareStatement(contains("SELECT id FROM"))).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true) // Arrange
            val service = IngredientCategoryService(mockConnection) // Arrange
            val result = service.addIngredientCategory(existingCategory) // Act
            assertNull(result) // Assert
        }
    }

    @Test
    fun `addIngredientCategory returns new ID on success`() {
        runBlocking {
            val newCategory = IngredientCategory(id = null, name = "New Unique Name") // Arrange
            val checkNameStatement: PreparedStatement = mock() // Arrange
            val addCategoryStatement: PreparedStatement = mock() // Arrange
            whenever(mockConnection.prepareStatement(contains("SELECT id FROM"))).thenReturn(checkNameStatement) // Arrange
            whenever(mockConnection.prepareStatement(contains("INSERT INTO"))).thenReturn(addCategoryStatement) // Arrange
            val checkNameResultSet: ResultSet = mock() // Arrange
            whenever(checkNameResultSet.next()).thenReturn(false) // Arrange
            whenever(checkNameStatement.executeQuery()).thenReturn(checkNameResultSet) // Arrange
            whenever(addCategoryStatement.executeUpdate()).thenReturn(1) // Arrange
            val service = IngredientCategoryService(mockConnection) // Arrange
            val result = service.addIngredientCategory(newCategory) // Act
            assertNotNull(result) // Assert
            assertTrue(result.isNotBlank()) // Assert
        }
    }

    @Test
    fun `addIngredientCategory returns null when database insert fails`() {
        runBlocking {
            val newCategory = IngredientCategory(id = null, name = "Another Name") // Arrange
            val checkNameStatement: PreparedStatement = mock() // Arrange
            val addCategoryStatement: PreparedStatement = mock() // Arrange
            whenever(mockConnection.prepareStatement(contains("SELECT id FROM"))).thenReturn(checkNameStatement) // Arrange
            whenever(mockConnection.prepareStatement(contains("INSERT INTO"))).thenReturn(addCategoryStatement) // Arrange
            val checkNameResultSet: ResultSet = mock() // Arrange
            whenever(checkNameResultSet.next()).thenReturn(false) // Arrange
            whenever(checkNameStatement.executeQuery()).thenReturn(checkNameResultSet) // Arrange
            whenever(addCategoryStatement.executeUpdate()).thenReturn(0) // Arrange
            val service = IngredientCategoryService(mockConnection) // Arrange
            val result = service.addIngredientCategory(newCategory) // Act
            assertNull(result) // Assert
        }
    }

    @Test
    fun `deleteIngredientCategory returns false if category is in use`() {
        runBlocking {
            val categoryId = "cat-1" // Arrange
            whenever(mockConnection.prepareStatement(contains("SELECT COUNT(*)"))).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true) // Arrange
            whenever(mockResultSet.getInt("count")).thenReturn(1) // Arrange
            val service = IngredientCategoryService(mockConnection) // Arrange
            val result = service.deleteIngredientCategory(categoryId) // Act
            assertFalse(result) // Assert
            verify(mockConnection, never()).prepareStatement(contains("UPDATE ingredient_categories SET is_deleted")) // Assert
        }
    }

    @Test
    fun `deleteIngredientCategory returns true on success`() {
        runBlocking {
            val categoryId = "cat-1" // Arrange
            val checkInUseStatement: PreparedStatement = mock() // Arrange
            val deleteStatement: PreparedStatement = mock() // Arrange
            whenever(mockConnection.prepareStatement(contains("SELECT COUNT(*)"))).thenReturn(checkInUseStatement) // Arrange
            whenever(mockConnection.prepareStatement(contains("UPDATE ingredient_categories SET is_deleted"))).thenReturn(deleteStatement) // Arrange
            val checkInUseResultSet: ResultSet = mock() // Arrange
            whenever(checkInUseResultSet.next()).thenReturn(true) // Arrange
            whenever(checkInUseResultSet.getInt("count")).thenReturn(0) // Arrange
            whenever(checkInUseStatement.executeQuery()).thenReturn(checkInUseResultSet) // Arrange
            whenever(deleteStatement.executeUpdate()).thenReturn(1) // Arrange
            val service = IngredientCategoryService(mockConnection) // Arrange
            val result = service.deleteIngredientCategory(categoryId) // Act
            assertTrue(result) // Assert

        }
    }

    @Test
    fun `deleteIngredientCategory returns false if category id does not exist`() {
        runBlocking {
            val categoryId = "non-existent-id" // Arrange
            val checkInUseStatement: PreparedStatement = mock() // Arrange
            val deleteStatement: PreparedStatement = mock() // Arrange
            whenever(mockConnection.prepareStatement(contains("SELECT COUNT(*)"))).thenReturn(checkInUseStatement) // Arrange
            whenever(mockConnection.prepareStatement(contains("UPDATE ingredient_categories SET is_deleted"))).thenReturn(deleteStatement) // Arrange
            val checkInUseResultSet: ResultSet = mock() // Arrange
            whenever(checkInUseResultSet.next()).thenReturn(true) // Arrange
            whenever(checkInUseResultSet.getInt("count")).thenReturn(0) // Arrange
            whenever(checkInUseStatement.executeQuery()).thenReturn(checkInUseResultSet) // Arrange
            whenever(deleteStatement.executeUpdate()).thenReturn(0) // Arrange
            val service = IngredientCategoryService(mockConnection) // Arrange
            val result = service.deleteIngredientCategory(categoryId) // Act
            assertFalse(result) // Assert
        }
    }

    @Test
    fun `updateIngredientCategory returns false if ID is null`() {
        runBlocking {
            val categoryWithNullId = IngredientCategory(id = null, name = "A Name") // Arrange
            val service = IngredientCategoryService(mockConnection) // Arrange
            val result = service.updateIngredientCategory(categoryWithNullId) // Act
            assertFalse(result) // Assert
            verify(mockConnection, never()).prepareStatement(any()) // Assert
        }
    }

    @Test
    fun `updateIngredientCategory returns false if name is blank`() {
        runBlocking {
            val categoryWithBlankName = IngredientCategory(id = "ing-cat-1", name = "  ") // Arrange
            val service = IngredientCategoryService(mockConnection) // Arrange
            val result = service.updateIngredientCategory(categoryWithBlankName) // Act
            assertFalse(result) // Assert
            verify(mockConnection, never()).prepareStatement(any()) // Assert
        }
    }

    @Test
    fun `updateIngredientCategory returns false if name already exists`() {
        runBlocking {
            val categoryToUpdate = IngredientCategory(id = "ing-cat-1", name = "Existing Name") // Arrange
            whenever(mockConnection.prepareStatement(contains("SELECT id FROM"))).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true) // Arrange
            val service = IngredientCategoryService(mockConnection) // Arrange
            val result = service.updateIngredientCategory(categoryToUpdate) // Act
            assertFalse(result) // Assert
        }
    }

    @Test
    fun `updateIngredientCategory returns true on success`() {
        runBlocking {
            val categoryToUpdate = IngredientCategory(id = "ing-cat-1", name = "New Valid Name") // Arrange
            val checkNameStatement: PreparedStatement = mock() // Arrange
            val updateStatement: PreparedStatement = mock() // Arrange
            whenever(mockConnection.prepareStatement(contains("SELECT id FROM"))).thenReturn(checkNameStatement) // Arrange
            whenever(mockConnection.prepareStatement(contains("UPDATE ingredient_categories"))).thenReturn(updateStatement) // Arrange
            val checkNameResultSet: ResultSet = mock() // Arrange
            whenever(checkNameResultSet.next()).thenReturn(false) // Arrange
            whenever(checkNameStatement.executeQuery()).thenReturn(checkNameResultSet) // Arrange
            whenever(updateStatement.executeUpdate()).thenReturn(1) // Arrange
            val service = IngredientCategoryService(mockConnection) // Arrange
            val result = service.updateIngredientCategory(categoryToUpdate) // Act
            assertTrue(result) // Assert
        }
    }

    @Test
    fun `updateIngredientCategory returns false when database update fails`() {
        runBlocking {
            val categoryToUpdate = IngredientCategory(id = "ing-cat-1", name = "New Valid Name") // Arrange
            val checkNameStatement: PreparedStatement = mock() // Arrange
            val updateStatement: PreparedStatement = mock() // Arrange
            whenever(mockConnection.prepareStatement(contains("SELECT id FROM"))).thenReturn(checkNameStatement) // Arrange
            whenever(mockConnection.prepareStatement(contains("UPDATE ingredient_categories"))).thenReturn(updateStatement) // Arrange
            val checkNameResultSet: ResultSet = mock() // Arrange
            whenever(checkNameResultSet.next()).thenReturn(false) // Arrange
            whenever(checkNameStatement.executeQuery()).thenReturn(checkNameResultSet) // Arrange
            whenever(updateStatement.executeUpdate()).thenReturn(0) // Arrange
            val service = IngredientCategoryService(mockConnection) // Arrange
            val result = service.updateIngredientCategory(categoryToUpdate) // Act
            assertFalse(result) // Assert
        }
    }
}