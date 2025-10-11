### Printing Data Models

These are the data models used by the printing and ticket template endpoints.

#### PrintRequest

Used to send a print request.

```kotlin
@Serializable
data class PrintRequest(
    val templateName: String, // Name of the template to use
    val ticketData: TicketData, // Data of the ticket to print
    val type: TicketType // Type of ticket (KITCHEN or CUSTOMER)
)
```

#### SetPrinterRequest

Used to assign a printer to a ticket type.

```kotlin
@Serializable
data class SetPrinterRequest(
    val type: TicketType, // KITCHEN or CUSTOMER
    val printerName: String // Name of the printer
)
```

#### TicketTemplate

Defines the structure and content of a ticket template.

```kotlin
@Serializable
data class TicketTemplate(
    val name: String, // Unique name of the template
    val elements: List<TicketElement> // List of elements that make up the ticket
)
```

#### TicketElement

Represents an individual element within a ticket template.

```kotlin
@Serializable
data class TicketElement(
    val type: ElementType, // Type of element (HEADER, TEXT, etc.)
    val value: String, // Content or placeholder (e.g. {{ticket.total}})
    val style: ElementStyle? = null // Optional style of the element
)
```

#### ElementType (Enum)

Defines the types of elements that can be used in a template.

- `HEADER`
- `TEXT`
- `LINE_BREAK`
- `SEPARATOR`
- `TABLE_HEADER`
- `TABLE_ROW`
- `FOOTER`

#### ElementStyle

Defines the style of a `TicketElement`.

```kotlin
@Serializable
data class ElementStyle(
    val bold: Boolean = false,
    val justification: Justification = Justification.LEFT,
    val fontSize: FontSize = FontSize.NORMAL
)
```

#### Justification (Enum)

Defines the text justification.

- `LEFT`
- `CENTER`
- `RIGHT`

#### FontSize (Enum)

Defines the font size.

- `NORMAL`
- `LARGE`
- `EXTRA_LARGE`

#### TicketData

Contains the specific data of a ticket to be printed.

```kotlin
@Serializable
data class TicketData(
    val ticketId: String,
    val tableName: String,
    val roomName: String,
    val date: String,
    val items: List<TicketDataItem>,
    val total: Double
)
```

#### TicketDataItem

Represents an individual item in the `TicketData` list.

```kotlin
@Serializable
data class TicketDataItem(
    val quantity: Int,
    val name: String,
    val price: Double,
    val comments: List<String> = emptyList()
)
```
