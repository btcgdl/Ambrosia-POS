package pos.ambrosia.services

import java.sql.Connection
import pos.ambrosia.models.Shift

// this is my model
// @Serializable
// data class Shift(
//         val id: String?,
//         val user_id: String,
//         val shift_date: String,
//         val start_time: String,
//         val end_time: String,
//         val notes: String
// )

class ShiftService(private val connection: Connection) {
    companion object {
        private const val ADD_SHIFT =
                "INSERT INTO shifts (id, user_id, shift_date, start_time, end_time, notes) VALUES (?, ?, ?, ?, ?, ?)"
        private const val GET_SHIFTS =
                "SELECT id, user_id, shift_date, start_time, end_time, notes FROM shifts"
        private const val GET_SHIFT_BY_ID =
                "SELECT id, user_id, shift_date, start_time, end_time, notes FROM shifts WHERE id = ?"
        private const val UPDATE_SHIFT =
                "UPDATE shifts SET user_id = ?, shift_date = ?, start_time = ?, end_time = ?, notes = ? WHERE id = ?"
        private const val DELETE_SHIFT = "DELETE FROM shifts WHERE id = ?"
    }

    fun addShift(shift: Shift): Boolean {
        val statement = connection.prepareStatement(ADD_SHIFT)
        statement.setString(1, shift.id)
        statement.setString(2, shift.user_id)
        statement.setString(3, shift.shift_date)
        statement.setString(4, shift.start_time)
        statement.setString(5, shift.end_time)
        statement.setString(6, shift.notes)
        return statement.executeUpdate() > 0
    }

    fun getShifts(): List<Shift> {
        val statement = connection.prepareStatement(GET_SHIFTS)
        val resultSet = statement.executeQuery()
        val shifts = mutableListOf<Shift>()
        while (resultSet.next()) {
            val shift =
                    Shift(
                            id = resultSet.getString("id"),
                            user_id = resultSet.getString("user_id"),
                            shift_date = resultSet.getString("shift_date"),
                            start_time = resultSet.getString("start_time"),
                            end_time = resultSet.getString("end_time"),
                            notes = resultSet.getString("notes")
                    )
            shifts.add(shift)
        }
        return shifts
    }

    fun getShiftById(id: String): Shift? {
        val statement = connection.prepareStatement(GET_SHIFT_BY_ID)
        statement.setString(1, id)
        val resultSet = statement.executeQuery()
        return if (resultSet.next()) {
            Shift(
                    id = resultSet.getString("id"),
                    user_id = resultSet.getString("user_id"),
                    shift_date = resultSet.getString("shift_date"),
                    start_time = resultSet.getString("start_time"),
                    end_time = resultSet.getString("end_time"),
                    notes = resultSet.getString("notes")
            )
        } else null
    }
    fun updateShift(shift: Shift): Boolean {
        val statement = connection.prepareStatement(UPDATE_SHIFT)
        statement.setString(1, shift.user_id)
        statement.setString(2, shift.shift_date)
        statement.setString(3, shift.start_time)
        statement.setString(4, shift.end_time)
        statement.setString(5, shift.notes)
        statement.setString(6, shift.id)
        return statement.executeUpdate() > 0
    }
    fun deleteShift(id: String): Boolean {
        val statement = connection.prepareStatement(DELETE_SHIFT)
        statement.setString(1, id)
        return statement.executeUpdate() > 0
    }
}
