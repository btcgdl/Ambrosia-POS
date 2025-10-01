package pos.ambrosia.utest

import kotlinx.coroutines.runBlocking
import org.mockito.ArgumentMatchers.contains
import org.mockito.kotlin.*
import pos.ambrosia.models.Ingredient
import pos.ambrosia.services.IngredientService
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet
import kotlin.test.*

class IngredientServiceTest {
    private val mockConnection: Connection = mock()
    private val mockStatement: PreparedStatement = mock()
    private val mockResultSet: ResultSet = mock()

    @Test
    fun `getIngredients returns list of ingredients when found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false) // Arrange
            whenever(mockResultSet.getString("id")).thenReturn("ing-1").thenReturn("ing-2") // Arrange
            whenever(mockResultSet.getString("name")).thenReturn("Tomatoes").thenReturn("Cheese") // Arrange
            whenever(mockResultSet.getString("category_id")).thenReturn("cat-veg").thenReturn("cat-dairy") // Arrange
            whenever(mockResultSet.getDouble("quantity")).thenReturn(10.5).thenReturn(5.0) // Arrange
            whenever(mockResultSet.getString("unit")).thenReturn("kg").thenReturn("kg") // Arrange
            whenever(mockResultSet.getDouble("low_stock_threshold")).thenReturn(2.0).thenReturn(1.0) // Arrange
            whenever(mockResultSet.getDouble("cost_per_unit")).thenReturn(3.50).thenReturn(8.0) // Arrange
            val service = IngredientService(mockConnection) // Arrange
            val result = service.getIngredients() // Act
            assertEquals(2, result.size) // Assert
            assertEquals("Tomatoes", result[0].name) // Assert
            assertEquals(5.0, result[1].quantity) // Assert
        }
    }

    @Test
    fun `getIngredients returns empty list when none found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(false) // Arrange
            val service = IngredientService(mockConnection) // Arrange
            val result = service.getIngredients() // Act
            assertTrue(result.isEmpty()) // Assert
        }
    }

    @Test
    fun `getIngredientById returns ingredient when found`() {
        runBlocking {
            val expectedIngredient = Ingredient("ing-1", "Tomatoes", "cat-veg", 10.5, "kg", 2.0, 3.50) // Arrange
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true) // Arrange
            whenever(mockResultSet.getString("id")).thenReturn(expectedIngredient.id) // Arrange
            whenever(mockResultSet.getString("name")).thenReturn(expectedIngredient.name) // Arrange
            whenever(mockResultSet.getString("category_id")).thenReturn(expectedIngredient.category_id) // Arrange
            whenever(mockResultSet.getDouble("quantity")).thenReturn(expectedIngredient.quantity) // Arrange
            whenever(mockResultSet.getString("unit")).thenReturn(expectedIngredient.unit) // Arrange
            whenever(mockResultSet.getDouble("low_stock_threshold")).thenReturn(expectedIngredient.low_stock_threshold) // Arrange
            whenever(mockResultSet.getDouble("cost_per_unit")).thenReturn(expectedIngredient.cost_per_unit) // Arrange
            val service = IngredientService(mockConnection) // Arrange
            val result = service.getIngredientById("ing-1") // Act
            assertNotNull(result) // Assert
            assertEquals(expectedIngredient, result) // Assert
        }
    }

    @Test
    fun `getIngredientById returns null when not found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(false) // Arrange
            val service = IngredientService(mockConnection) // Arrange
            val result = service.getIngredientById("not-found") // Act
            assertNull(result) // Assert
        }
    }

    @Test
    fun `getIngredientsByCategory returns ingredients when found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true).thenReturn(false) // Arrange
            whenever(mockResultSet.getString("id")).thenReturn("ing-1") // Arrange
            whenever(mockResultSet.getString("name")).thenReturn("Tomatoes") // Arrange
            whenever(mockResultSet.getString("category_id")).thenReturn("cat-veg") // Arrange
            whenever(mockResultSet.getDouble("quantity")).thenReturn(10.5) // Arrange
            whenever(mockResultSet.getString("unit")).thenReturn("kg") // Arrange
            whenever(mockResultSet.getDouble("low_stock_threshold")).thenReturn(2.0) // Arrange
            whenever(mockResultSet.getDouble("cost_per_unit")).thenReturn(3.50) // Arrange
            val service = IngredientService(mockConnection) // Arrange
            val result = service.getIngredientsByCategory("cat-veg") // Act
            assertEquals(1, result.size) // Assert
            assertEquals("Tomatoes", result[0].name) // Assert
        }
    }

    @Test
    fun `getIngredientsByCategory returns empty list when none found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(false) // Arrange
            val service = IngredientService(mockConnection) // Arrange
            val result = service.getIngredientsByCategory("cat-dairy") // Act
            assertTrue(result.isEmpty()) // Assert
        }
    }

    @Test
    fun `addIngredient returns null if category does not exist`() {
        runBlocking {
            val newIngredient = Ingredient(null, "Tomatoes", "non-existent-cat", 10.0, "kg", 1.0, 1.0) // Arrange
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(false) // Arrange: Simulate category not found
            val service = IngredientService(mockConnection) // Arrange
            val result = service.addIngredient(newIngredient) // Act
            assertNull(result) // Assert
            verify(mockConnection, never()).prepareStatement(contains("INSERT INTO")) // Assert
        }
    }

    @Test
    fun `addIngredient returns null if name is blank`() {
        runBlocking {
            val ingredientWithBlankName = Ingredient(null, "  ", "cat-veg", 10.0, "kg", 1.0, 1.0) // Arrange
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true) // Arrange: Simulate category exists
            val service = IngredientService(mockConnection) // Arrange
            val result = service.addIngredient(ingredientWithBlankName) // Act
            assertNull(result) // Assert
        }
    }

    @Test
    fun `addIngredient returns null if quantity is invalid`() {
        runBlocking {
            val ingredientWithInvalidQuantity = Ingredient(null, "Tomatoes", "cat-veg", -5.0, "kg", 1.0, 1.0) // Arrange
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true) // Arrange: Simulate category exists
            val service = IngredientService(mockConnection) // Arrange
            val result = service.addIngredient(ingredientWithInvalidQuantity) // Act
            assertNull(result) // Assert
        }
    }

    @Test
    fun `addIngredient returns null if low stock threshold is invalid`() {
        runBlocking {
            val ingredientWithInvalidThreshold = Ingredient(null, "Tomatoes", "cat-veg", 10.0, "kg", -1.0, 1.0) // Arrange
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true) // Arrange: Simulate category exists
            val service = IngredientService(mockConnection) // Arrange
            val result = service.addIngredient(ingredientWithInvalidThreshold) // Act
            assertNull(result) // Assert
        }
    }

    @Test
    fun `addIngredient returns null if cost per unit is invalid`() {
        runBlocking {
            val ingredientWithInvalidCost = Ingredient(null, "Tomatoes", "cat-veg", 10.0, "kg", 1.0, -1.0) // Arrange
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true) // Arrange: Simulate category exists
            val service = IngredientService(mockConnection) // Arrange
            val result = service.addIngredient(ingredientWithInvalidCost) // Act
            assertNull(result) // Assert
        }
    }

    @Test
    fun `addIngredient returns new ID on success`() {
        runBlocking {
            val newIngredient = Ingredient(null, "New Ingredient", "cat-1", 15.0, "kg", 1.0, 1.0) // Arrange
            val categoryCheckStatement: PreparedStatement = mock() // Arrange
            val addIngredientStatement: PreparedStatement = mock() // Arrange
            whenever(mockConnection.prepareStatement(contains("SELECT id FROM ingredient_categories"))).thenReturn(categoryCheckStatement) // Arrange
            whenever(mockConnection.prepareStatement(contains("INSERT INTO ingredients"))).thenReturn(addIngredientStatement) // Arrange
            val categoryCheckResultSet: ResultSet = mock() // Arrange
            whenever(categoryCheckResultSet.next()).thenReturn(true) // Arrange
            whenever(categoryCheckStatement.executeQuery()).thenReturn(categoryCheckResultSet) // Arrange
            whenever(addIngredientStatement.executeUpdate()).thenReturn(1) // Arrange
            val service = IngredientService(mockConnection) // Arrange
            val result = service.addIngredient(newIngredient) // Act
            assertNotNull(result) // Assert
            assertTrue(result.isNotBlank()) // Assert
        }
    }

    @Test
    fun `addIngredient returns null when database insert fails`() {
        runBlocking {
            val newIngredient = Ingredient(null, "New Ingredient", "cat-1", 15.0, "kg", 1.0, 1.0) // Arrange
            val categoryCheckStatement: PreparedStatement = mock() // Arrange
            val addIngredientStatement: PreparedStatement = mock() // Arrange
            whenever(mockConnection.prepareStatement(contains("SELECT id FROM ingredient_categories"))).thenReturn(categoryCheckStatement) // Arrange
            whenever(mockConnection.prepareStatement(contains("INSERT INTO ingredients"))).thenReturn(addIngredientStatement) // Arrange
            val categoryCheckResultSet: ResultSet = mock() // Arrange
            whenever(categoryCheckResultSet.next()).thenReturn(true) // Arrange
            whenever(categoryCheckStatement.executeQuery()).thenReturn(categoryCheckResultSet) // Arrange
            whenever(addIngredientStatement.executeUpdate()).thenReturn(0) // Arrange
            val service = IngredientService(mockConnection) // Arrange
            val result = service.addIngredient(newIngredient) // Act
            assertNull(result) // Assert
        }
    }
}