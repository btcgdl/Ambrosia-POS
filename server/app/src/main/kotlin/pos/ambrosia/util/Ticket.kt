
package pos.ambrosia.util
import kotlinx.serialization.Serializable
import pos.ambrosia.models.TicketEntry

@Serializable
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