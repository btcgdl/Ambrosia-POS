package pos.ambrosia.services

import pos.ambrosia.models.User

class UsersService {
    // Simulate a database of users
    private val users = mutableListOf<User>()

    suspend fun addUser(user: User) {
        users.add(user)
    }

    suspend fun getUsers(): List<User> {
        return users
    }

    suspend fun getUserById(id: String): User? {
        return users.find { it.id == id }
    }

    suspend fun updateUser(id: String, updatedUser: User): Boolean {
        val index = users.indexOfFirst { it.id == id }
        if (index != -1) {
            users[index] = updatedUser
            return true
        }
        return false
    }

    suspend fun deleteUser(id: String): Boolean {
        return users.removeIf { it.id == id }
    }
}