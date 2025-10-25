package pos.ambrosia.utest

import kotlinx.coroutines.runBlocking
import org.mockito.ArgumentMatchers.contains
import org.mockito.kotlin.*
import pos.ambrosia.models.ProductCategory
import pos.ambrosia.services.ProductCategoryService
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet
import kotlin.test.*

class ProductCategoryServiceTest {
    private val mockConnection: Connection = mock()
    private val mockStatement: PreparedStatement = mock()
    private val mockResultSet: ResultSet = mock()

    @Test
    fun `getCategories returns list when found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement)
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet)
            whenever(mockResultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false)
            whenever(mockResultSet.getString("id")).thenReturn("cat-1").thenReturn("cat-2")
            whenever(mockResultSet.getString("name")).thenReturn("Bebidas").thenReturn("Postres")

            val service = ProductCategoryService(mockConnection)
            val result = service.getCategories()

            assertEquals(2, result.size)
            assertEquals("Bebidas", result[0].name)
            assertEquals("Postres", result[1].name)
        }
    }

    @Test
    fun `getCategories returns empty when none found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement)
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet)
            whenever(mockResultSet.next()).thenReturn(false)

            val service = ProductCategoryService(mockConnection)
            val result = service.getCategories()
            assertTrue(result.isEmpty())
        }
    }

    @Test
    fun `getCategoryById returns item when found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement)
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet)
            whenever(mockResultSet.next()).thenReturn(true)
            whenever(mockResultSet.getString("id")).thenReturn("cat-1")
            whenever(mockResultSet.getString("name")).thenReturn("Bebidas")

            val service = ProductCategoryService(mockConnection)
            val result = service.getCategoryById("cat-1")

            assertNotNull(result)
            assertEquals(ProductCategory(id = "cat-1", name = "Bebidas"), result)
        }
    }

    @Test
    fun `getCategoryById returns null when not found`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(any())).thenReturn(mockStatement)
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet)
            whenever(mockResultSet.next()).thenReturn(false)

            val service = ProductCategoryService(mockConnection)
            val result = service.getCategoryById("missing")
            assertNull(result)
        }
    }

    @Test
    fun `addCategory returns null if name blank`() {
        runBlocking {
            val service = ProductCategoryService(mockConnection)
            val result = service.addCategory(ProductCategory(id = null, name = "  "))
            assertNull(result)
            verify(mockConnection, never()).prepareStatement(any())
        }
    }

    @Test
    fun `addCategory returns null if name exists`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(contains("SELECT id FROM product_categories")) ).thenReturn(mockStatement)
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet)
            whenever(mockResultSet.next()).thenReturn(true)

            val service = ProductCategoryService(mockConnection)
            val result = service.addCategory(ProductCategory(id = null, name = "Bebidas"))
            assertNull(result)
        }
    }

    @Test
    fun `addCategory returns new id on success`() {
        runBlocking {
            val checkNameStatement: PreparedStatement = mock()
            val insertStatement: PreparedStatement = mock()
            val checkNameResultSet: ResultSet = mock()

            whenever(mockConnection.prepareStatement(contains("SELECT id FROM product_categories"))).thenReturn(checkNameStatement)
            whenever(mockConnection.prepareStatement(contains("INSERT INTO product_categories"))).thenReturn(insertStatement)

            whenever(checkNameResultSet.next()).thenReturn(false)
            whenever(checkNameStatement.executeQuery()).thenReturn(checkNameResultSet)

            whenever(insertStatement.executeUpdate()).thenReturn(1)

            val service = ProductCategoryService(mockConnection)
            val id = service.addCategory(ProductCategory(id = null, name = "Lácteos"))
            assertNotNull(id)
        }
    }

    @Test
    fun `updateCategory returns false if id null`() {
        runBlocking {
            val service = ProductCategoryService(mockConnection)
            val ok = service.updateCategory(ProductCategory(id = null, name = "Bebidas"))
            assertFalse(ok)
            verify(mockConnection, never()).prepareStatement(any())
        }
    }

    @Test
    fun `updateCategory returns false if name blank`() {
        runBlocking {
            val service = ProductCategoryService(mockConnection)
            val ok = service.updateCategory(ProductCategory(id = "cat-1", name = "  "))
            assertFalse(ok)
            verify(mockConnection, never()).prepareStatement(any())
        }
    }

    @Test
    fun `updateCategory returns false if name exists`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(contains("SELECT id FROM product_categories"))).thenReturn(mockStatement)
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet)
            whenever(mockResultSet.next()).thenReturn(true)

            val service = ProductCategoryService(mockConnection)
            val ok = service.updateCategory(ProductCategory(id = "cat-1", name = "Duplicado"))
            assertFalse(ok)
        }
    }

    @Test
    fun `updateCategory returns true on success`() {
        runBlocking {
            val checkNameStatement: PreparedStatement = mock()
            val updateStatement: PreparedStatement = mock()
            val checkNameResultSet: ResultSet = mock()

            whenever(mockConnection.prepareStatement(contains("SELECT id FROM product_categories"))).thenReturn(checkNameStatement)
            whenever(mockConnection.prepareStatement(contains("UPDATE product_categories SET name"))).thenReturn(updateStatement)

            whenever(checkNameResultSet.next()).thenReturn(false)
            whenever(checkNameStatement.executeQuery()).thenReturn(checkNameResultSet)

            whenever(updateStatement.executeUpdate()).thenReturn(1)

            val service = ProductCategoryService(mockConnection)
            val ok = service.updateCategory(ProductCategory(id = "cat-1", name = "Bebidas"))
            assertTrue(ok)
        }
    }

    @Test
    fun `deleteCategory returns false if in use`() {
        runBlocking {
            whenever(mockConnection.prepareStatement(contains("SELECT COUNT(*) as count FROM products"))).thenReturn(mockStatement)
            whenever(mockStatement.executeQuery()).thenReturn(mockResultSet)
            whenever(mockResultSet.next()).thenReturn(true)
            whenever(mockResultSet.getInt("count")).thenReturn(1)

            val service = ProductCategoryService(mockConnection)
            val ok = service.deleteCategory("cat-1")
            assertFalse(ok)
            verify(mockConnection, never()).prepareStatement(contains("UPDATE product_categories SET is_deleted"))
        }
    }

    @Test
    fun `deleteCategory returns true on success`() {
        runBlocking {
            val checkUseStatement: PreparedStatement = mock()
            val deleteStatement: PreparedStatement = mock()
            val checkUseResultSet: ResultSet = mock()

            whenever(mockConnection.prepareStatement(contains("SELECT COUNT(*) as count FROM products"))).thenReturn(checkUseStatement)
            whenever(mockConnection.prepareStatement(contains("UPDATE product_categories SET is_deleted"))).thenReturn(deleteStatement)

            whenever(checkUseResultSet.next()).thenReturn(true)
            whenever(checkUseResultSet.getInt("count")).thenReturn(0)
            whenever(checkUseStatement.executeQuery()).thenReturn(checkUseResultSet)

            whenever(deleteStatement.executeUpdate()).thenReturn(1)

            val service = ProductCategoryService(mockConnection)
            val ok = service.deleteCategory("cat-1")
            assertTrue(ok)
        }
    }

    @Test
    fun `deleteCategory returns false if id not found`() {
        runBlocking {
            val checkUseStatement: PreparedStatement = mock()
            val deleteStatement: PreparedStatement = mock()
            val checkUseResultSet: ResultSet = mock()

            whenever(mockConnection.prepareStatement(contains("SELECT COUNT(*) as count FROM products"))).thenReturn(checkUseStatement)
            whenever(mockConnection.prepareStatement(contains("UPDATE product_categories SET is_deleted"))).thenReturn(deleteStatement)

            whenever(checkUseResultSet.next()).thenReturn(true)
            whenever(checkUseResultSet.getInt("count")).thenReturn(0)
            whenever(checkUseStatement.executeQuery()).thenReturn(checkUseResultSet)

            whenever(deleteStatement.executeUpdate()).thenReturn(0)

            val service = ProductCategoryService(mockConnection)
            val ok = service.deleteCategory("nope")
            assertFalse(ok)
        }
    }
}

