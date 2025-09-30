package pos.ambrosia.services

import com.github.anastaciocintra.escpos.EscPos
import com.github.anastaciocintra.escpos.EscPosConst
import com.github.anastaciocintra.escpos.Style
import pos.ambrosia.models.*
import pos.ambrosia.util.formatTicketLine

class TicketFactory(private val template: TicketTemplate) {

  fun build(escpos: EscPos, data: TicketData, config: Config?) {
    template.elements.forEach { element ->
      val style = convertToEscPosStyle(element.style)
      val content = resolveValue(element.value, data, config)

      when (element.type) {
        ElementType.SEPARATOR -> escpos.writeLF(style, content.repeat(48))
        ElementType.TABLE_HEADER -> escpos.writeLF(style, content)
        ElementType.TABLE_ROW -> {
          data.items.forEach {
            val itemText = "${it.quantity}x ${it.name}"
            val priceText = it.price.toString()
            val row = formatTicketLine(itemText, priceText)
            escpos.writeLF(style, row)
            it.comments.forEach { comment ->
                escpos.writeLF(style, "  - $comment")
            }
          }
        }
        else -> escpos.writeLF(style, content)
      }
    }
  }

  private fun resolveValue(value: String, item: TicketDataItem): String {
    return value.replace("{{item.quantity}}", item.quantity.toString())
            .replace("{{item.name}}", item.name)
            .replace("{{item.price}}", item.price.toString())
  }

  private fun resolveValue(value: String, data: TicketData, config: Config?): String {
    var resolved = value
    config?.let {
      resolved = resolved.replace("{{config.restaurantName}}", it.restaurantName)
      resolved = resolved.replace("{{config.address}}", it.address ?: "")
      resolved = resolved.replace("{{config.phone}}", it.phone ?: "")
    }

    return resolved.replace("{{ticket.id}}", data.ticketId)
            .replace("{{ticket.tableName}}", data.tableName)
            .replace("{{ticket.roomName}}", data.roomName)
            .replace("{{ticket.date}}", data.date)
            .replace("{{ticket.total}}", data.total.toString())
  }

  private fun convertToEscPosStyle(elementStyle: ElementStyle?): Style {
    val escposStyle = Style()
    elementStyle?.let {
      if (it.bold) {
        escposStyle.setBold(true)
      }
      escposStyle.setJustification(
              when (it.justification) {
                Justification.LEFT -> EscPosConst.Justification.Left_Default
                Justification.CENTER -> EscPosConst.Justification.Center
                Justification.RIGHT -> EscPosConst.Justification.Right
              }
      )
      escposStyle.setFontSize(
              when (it.fontSize) {
                FontSize.NORMAL -> Style.FontSize.`_1`
                FontSize.LARGE -> Style.FontSize.`_2`
                FontSize.EXTRA_LARGE -> Style.FontSize.`_3`
              },
              Style.FontSize.`_1`
      )
    }
    return escposStyle
  }
}
