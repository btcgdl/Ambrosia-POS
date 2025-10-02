package pos.ambrosia.utest

import kotlinx.coroutines.runBlocking
import org.mockito.ArgumentMatchers.contains
import org.mockito.kotlin.*
import pos.ambrosia.models.OrderDish
import pos.ambrosia.services.OrderDishService
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet
import kotlin.test.*

class OrderDishServiceTest {
    private val mockConnection: Connection = mock()
    private val mockStatement: PreparedStatement = mock()
    private val mockResultSet: ResultSet = mock()

    @Test
    fun `getOrderDishesByOrderId returns list of dishes when found`() {
        runBlocking {
            val orderDish1 = OrderDish(id = "od1", order_id = "order123", dish_id = "dish1", price_at_order = 50.00, notes = "Extra spicy", status = "PENDING", should_prepare = true) // Arrange
            val orderDish2 = OrderDish(id = "od2", order_id = "order123", dish_id = "dish2", price_at_order = 100.00, notes = "No onion", status = "PENDING", should_prepare = true) // Arrange
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false) // Arrange
            whenever(mockResultSet.getString("id")).thenReturn(orderDish1.id).thenReturn(orderDish2.id) // Arrange
            whenever(mockResultSet.getString("order_id")).thenReturn(orderDish1.order_id).thenReturn(orderDish2.order_id) // Arrange
            whenever(mockResultSet.getString("dish_id")).thenReturn(orderDish1.dish_id).thenReturn(orderDish2.dish_id) // Arrange
            whenever(mockResultSet.getDouble("price_at_order")).thenReturn(orderDish1.price_at_order).thenReturn(orderDish2.price_at_order) // Arrange
            whenever(mockResultSet.getString("notes")).thenReturn(orderDish1.notes).thenReturn(orderDish2.notes) // Arrange
            whenever(mockResultSet.getString("status")).thenReturn(orderDish1.status).thenReturn(orderDish2.status) // Arrange
            whenever(mockResultSet.getBoolean("should_prepare")).thenReturn(orderDish1.should_prepare).thenReturn(orderDish2.should_prepare) // Arrange
            val service = OrderDishService(mockConnection) // Arrange
            val result = service.getOrderDishesByOrderId("order123") // Act
            assertEquals(2, result.size) // Assert
            assertEquals("dish1", result[0].dish_id) // Assert
        }
    }

    @Test
    fun `getOrderDishesByOrderId returns empty list when none found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(false) // Arrange
            val service = OrderDishService(mockConnection) // Arrange
            val result = service.getOrderDishesByOrderId("od1") // Act
            assertTrue(result.isEmpty()) // Assert
        }
    }

    @Test
    fun `getOrderDishById returns dish when found`() {
        runBlocking {
            val expectedOrderDish = OrderDish(order_id = "od1", dish_id = "dish1", price_at_order = 50.00, status = "PENDING", should_prepare = true) // Arrange
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(true) // Arrange
            whenever(mockResultSet.getString("order_id")).thenReturn(expectedOrderDish.order_id) // Arrange
            whenever(mockResultSet.getString("dish_id")).thenReturn(expectedOrderDish.dish_id) // Arrange
            whenever(mockResultSet.getDouble("price_at_order")).thenReturn(expectedOrderDish.price_at_order) // Arrange
            whenever(mockResultSet.getString("status")).thenReturn(expectedOrderDish.status) // Arrange
            whenever(mockResultSet.getBoolean("should_prepare")).thenReturn(expectedOrderDish.should_prepare) // Arrange
            val service = OrderDishService(mockConnection) // Arrange
            val result = service.getOrderDishById("od1") // Act
            assertNotNull(result) // Assert
            assertEquals(expectedOrderDish, result) // Assert
        }
    }

    @Test
    fun `getOrderDishById returns null when none found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement) // Arrange
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet) // Arrange
            whenever(mockResultSet.next()).thenReturn(false) // Arrange
            val service = OrderDishService(mockConnection) // Arrange
            val result = service.getOrderDishById("not-found") // Act
            assertNull(result) // Assert
        }
    }
}