
package pos.ambrosia.util

data class TicketEntry(
	var name: String,
	var comments: MutableList<String> = mutableListOf(),
	var number: Int = 0,
	var cost: Double? = null
)

class Ticket {
	val entries: MutableList<TicketEntry> = mutableListOf()

	fun addEntry(entry: TicketEntry) {
		for (e in entries) {
			if (e.name == entry.name) {
				e.number += entry.number
				e.comments.addAll(entry.comments)
				return
			}
		}
		entries.add(entry)
	}

	fun elementCount(): Int {
		var res = 0
		for (e in entries) {
			res += e.number
		}
		return res
	}
}