### Modelos de Datos de Impresión

Estos son los modelos de datos utilizados por los endpoints de impresión y plantillas de tickets.

#### PrintRequest

Utilizado para enviar una solicitud de impresión.

```kotlin
@Serializable
data class PrintRequest(
    val templateName: String, // Nombre de la plantilla a utilizar
    val ticketData: TicketData, // Datos del ticket a imprimir
    val type: TicketType // Tipo de ticket (KITCHEN o CUSTOMER)
)
```

#### SetPrinterRequest

Utilizado para asignar una impresora a un tipo de ticket.

```kotlin
@Serializable
data class SetPrinterRequest(
    val type: TicketType, // KITCHEN o CUSTOMER
    val printerName: String // Nombre de la impresora
)
```

#### TicketTemplate

Define la estructura y contenido de una plantilla de ticket.

```kotlin
@Serializable
data class TicketTemplate(
    val name: String, // Nombre único de la plantilla
    val elements: List<TicketElement> // Lista de elementos que componen el ticket
)
```

#### TicketElement

Representa un elemento individual dentro de una plantilla de ticket.

```kotlin
@Serializable
data class TicketElement(
    val type: ElementType, // Tipo de elemento (HEADER, TEXT, etc.)
    val value: String, // Contenido o placeholder (ej. {{ticket.total}})
    val style: ElementStyle? = null // Estilo opcional del elemento
)
```

#### ElementType (Enum)

Define los tipos de elementos que se pueden utilizar en una plantilla.

- `HEADER`
- `TEXT`
- `LINE_BREAK`
- `SEPARATOR`
- `TABLE_HEADER`
- `TABLE_ROW`
- `FOOTER`

#### ElementStyle

Define el estilo de un `TicketElement`.

```kotlin
@Serializable
data class ElementStyle(
    val bold: Boolean = false,
    val justification: Justification = Justification.LEFT,
    val fontSize: FontSize = FontSize.NORMAL
)
```

#### Justification (Enum)

Define la justificación del texto.

- `LEFT`
- `CENTER`
- `RIGHT`

#### FontSize (Enum)

Define el tamaño de la fuente.

- `NORMAL`
- `LARGE`
- `EXTRA_LARGE`

#### TicketData

Contiene los datos específicos de un ticket para ser impreso.

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

Representa un ítem individual en la lista de `TicketData`.

```kotlin
@Serializable
data class TicketDataItem(
    val quantity: Int,
    val name: String,
    val price: Double,
    val comments: List<String> = emptyList()
)
```
