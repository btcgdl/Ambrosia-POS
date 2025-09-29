package pos.ambrosia.models

object DefaultTemplates {
    val defaultCustomerTicket = TicketTemplate(
        name = "Default Customer Ticket",
        elements = listOf(
            TicketElement(ElementType.HEADER, "{{config.restaurantName}}", ElementStyle(bold = true, justification = Justification.CENTER, fontSize = FontSize.LARGE)),
            TicketElement(ElementType.TEXT, "{{config.address}}", ElementStyle(justification = Justification.CENTER)),
            TicketElement(ElementType.TEXT, "TEL: {{config.phone}}", ElementStyle(justification = Justification.CENTER)),
            TicketElement(ElementType.LINE_BREAK, ""),
            TicketElement(ElementType.TEXT, "Table: {{ticket.tableName}}   Date: {{ticket.date}}"),
            TicketElement(ElementType.TEXT, "Room: {{ticket.roomName}}"),
            TicketElement(ElementType.TEXT, "Ticket: {{ticket.id}}"),
            TicketElement(ElementType.LINE_BREAK, ""),
            TicketElement(ElementType.SEPARATOR, "-"),
            TicketElement(ElementType.TABLE_HEADER, "Item                      Total"),
            TicketElement(ElementType.SEPARATOR, "-"),
            TicketElement(ElementType.TABLE_ROW, "{{item.quantity}}x {{item.name}}       {{item.price}}"),
            TicketElement(ElementType.SEPARATOR, "-"),
            TicketElement(ElementType.TEXT, "Total: {{ticket.total}}", ElementStyle(justification = Justification.RIGHT, bold = true)),
            TicketElement(ElementType.LINE_BREAK, ""),
            TicketElement(ElementType.FOOTER, "Thank you!", ElementStyle(justification = Justification.CENTER))
        )
    )
}