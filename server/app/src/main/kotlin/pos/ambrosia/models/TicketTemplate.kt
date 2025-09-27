package pos.ambrosia.models

import kotlinx.serialization.Serializable

@Serializable
data class PrintRequest(
    val templateName: String,
    val ticketData: TicketData,
    val type: TicketType
)

@Serializable
data class TicketTemplate(
    val name: String,
    val elements: List<TicketElement>
)

@Serializable
data class TicketElement(
    val type: ElementType,
    val value: String, // Can be a literal string or a placeholder like {{ticket.total}}
    val style: ElementStyle? = null
)

@Serializable
enum class ElementType {
    HEADER,
    TEXT,
    LINE_BREAK,
    SEPARATOR,
    TABLE_HEADER,
    TABLE_ROW,
    FOOTER
}

@Serializable
data class ElementStyle(
    val bold: Boolean = false,
    val justification: Justification = Justification.LEFT,
    val fontSize: FontSize = FontSize.NORMAL
)

@Serializable
enum class Justification { LEFT, CENTER, RIGHT }

@Serializable
enum class FontSize { NORMAL, LARGE, EXTRA_LARGE }
