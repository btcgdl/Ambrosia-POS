package pos.ambrosia.services

import java.sql.Connection
import pos.ambrosia.logger
import pos.ambrosia.models.ProductCategory

class ProductCategoryService(private val connection: Connection) {
  companion object {
    private const val ADD_CATEGORY = "INSERT INTO categories (id, name, type, is_deleted) VALUES (?, ?, 'product', 0)"
    private const val GET_CATEGORIES = "SELECT id, name FROM categories WHERE type = 'product' AND is_deleted = 0"
    private const val GET_CATEGORY_BY_ID = "SELECT id, name FROM categories WHERE id = ? AND type = 'product' AND is_deleted = 0"
    private const val UPDATE_CATEGORY = "UPDATE categories SET name = ? WHERE id = ? AND type = 'product'"
    private const val DELETE_CATEGORY = "UPDATE categories SET is_deleted = 1 WHERE id = ? AND type = 'product'"
    private const val CHECK_CATEGORY_IN_USE = "SELECT COUNT(*) as count FROM products WHERE category_id = ? AND is_deleted = 0"
    private const val CHECK_NAME_EXISTS = "SELECT id FROM categories WHERE name = ? AND type = 'product' AND is_deleted = 0 AND id != ?"
  }

  private fun categoryInUse(categoryId: String): Boolean {
    val st = connection.prepareStatement(CHECK_CATEGORY_IN_USE)
    st.setString(1, categoryId)
    val rs = st.executeQuery()
    return if (rs.next()) rs.getInt("count") > 0 else false
  }

  private fun nameExists(name: String, excludeId: String? = null): Boolean {
    val st = connection.prepareStatement(CHECK_NAME_EXISTS)
    st.setString(1, name)
    st.setString(2, excludeId ?: "")
    val rs = st.executeQuery()
    return rs.next()
  }

  private fun map(rs: java.sql.ResultSet): ProductCategory {
    return ProductCategory(id = rs.getString("id"), name = rs.getString("name"))
  }

  suspend fun addCategory(category: ProductCategory): String? {
    if (category.name.isBlank()) return null
    if (nameExists(category.name)) return null
    val id = java.util.UUID.randomUUID().toString()
    val st = connection.prepareStatement(ADD_CATEGORY)
    st.setString(1, id)
    st.setString(2, category.name)
    val rows = st.executeUpdate()
    return if (rows > 0) {
      logger.info("Product category created: $id")
      id
    } else null
  }

  suspend fun getCategories(): List<ProductCategory> {
    val st = connection.prepareStatement(GET_CATEGORIES)
    val rs = st.executeQuery()
    val out = mutableListOf<ProductCategory>()
    while (rs.next()) out.add(map(rs))
    return out
  }

  suspend fun getCategoryById(id: String): ProductCategory? {
    val st = connection.prepareStatement(GET_CATEGORY_BY_ID)
    st.setString(1, id)
    val rs = st.executeQuery()
    return if (rs.next()) map(rs) else null
  }

  suspend fun updateCategory(category: ProductCategory): Boolean {
    if (category.id == null) return false
    if (category.name.isBlank()) return false
    if (nameExists(category.name, category.id)) return false
    val st = connection.prepareStatement(UPDATE_CATEGORY)
    st.setString(1, category.name)
    st.setString(2, category.id)
    val rows = st.executeUpdate()
    if (rows > 0) logger.info("Product category updated: ${category.id}")
    return rows > 0
  }

  suspend fun deleteCategory(id: String): Boolean {
    if (categoryInUse(id)) return false
    val st = connection.prepareStatement(DELETE_CATEGORY)
    st.setString(1, id)
    val rows = st.executeUpdate()
    if (rows > 0) logger.info("Product category deleted: $id")
    return rows > 0
  }
}
