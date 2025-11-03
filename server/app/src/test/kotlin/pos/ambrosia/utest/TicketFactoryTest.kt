package pos.ambrosia.utest

import com.github.anastaciocintra.escpos.EscPos
import com.github.anastaciocintra.escpos.Style
import org.mockito.kotlin.*
import pos.ambrosia.models.*
import pos.ambrosia.services.TicketFactory
import kotlin.test.Test
import kotlin.test.assertEquals

class TicketFactoryTest {

    @Test
    fun `build should process a simple text element`() {
        // Arrange
        val mockEscpos: EscPos = mock()
        val template = TicketTemplate(
            name = "Test Template",
            elements = listOf(
                TicketElement(
                    type = ElementType.TEXT,
                    value = "Welcome to {{config.restaurantName}}"
                )
            )
        )
        val ticketData = TicketData(
            ticketId = "123",
            tableName = "Table 1",
            roomName = "Main Room",
            date = "2025-10-31",
            items = emptyList(),
            total = 0.0
        )
        val config = Config(
            restaurantName = "Ambrosia",
            address = null,
            phone = null,
            email = null,
            taxId = null,
            logo = null
        )

        val ticketFactory = TicketFactory(template)

        // Act
        ticketFactory.build(mockEscpos, ticketData, config)

        // Assert
        verify(mockEscpos).writeLF(any<Style>(), eq("Welcome to Ambrosia"))
    }

    @Test
    fun `build should process table row elements`() {
        // Arrange
        val mockEscpos: EscPos = mock()
        val stringCaptor = argumentCaptor<String>()
        val template = TicketTemplate(
            name = "Table Row Template",
            elements = listOf(
                TicketElement(
                    type = ElementType.TABLE_ROW,
                    value = "", // Value is ignored for TABLE_ROW
                    style = ElementStyle(bold = false, justification = Justification.LEFT, fontSize = FontSize.NORMAL)
                )
            )
        )
        val ticketData = TicketData(
            ticketId = "456",
            tableName = "Table 2",
            roomName = "Patio",
            date = "2025-10-31",
            items = listOf(
                TicketDataItem(quantity = 1, name = "Burger", price = 12.50, comments = listOf("No pickles", "Well done")),
                TicketDataItem(quantity = 2, name = "Fries", price = 3.00)
            ),
            total = 18.50
        )
        val config = Config(
            restaurantName = "Ambrosia",
            address = null,
            phone = null,
            email = null,
            taxId = null,
            logo = null
        )

        val ticketFactory = TicketFactory(template)

        // Act
        ticketFactory.build(mockEscpos, ticketData, config)

        // Assert
        verify(mockEscpos, times(4)).writeLF(any<Style>(), stringCaptor.capture())
        val capturedStrings = stringCaptor.allValues

        assert(capturedStrings[0].startsWith("1x Burger"))
        assert(capturedStrings[0].endsWith("12.5"))
        assertEquals("  - No pickles", capturedStrings[1])
        assertEquals("  - Well done", capturedStrings[2])
        assert(capturedStrings[3].startsWith("2x Fries"))
        assert(capturedStrings[3].endsWith("3.0"))
    }

    @Test
    fun `build should process separator element`() {
        // Arrange
        val mockEscpos: EscPos = mock()
        val template = TicketTemplate(
            name = "Separator Template",
            elements = listOf(
                TicketElement(
                    type = ElementType.SEPARATOR,
                    value = "-"
                )
            )
        )
        val ticketData = TicketData(
            ticketId = "789",
            tableName = "Table 3",
            roomName = "Bar",
            date = "2025-10-31",
            items = emptyList(),
            total = 0.0
        )
        val config = Config(
            restaurantName = "Ambrosia",
            address = null,
            phone = null,
            email = null,
            taxId = null,
            logo = null
        )

        val ticketFactory = TicketFactory(template)

        // Act
        ticketFactory.build(mockEscpos, ticketData, config)

        // Assert
        verify(mockEscpos).writeLF(any<Style>(), eq("-".repeat(48)))
    }

    @Test
    fun `build should process table header element`() {
        // Arrange
        val mockEscpos: EscPos = mock()
        val template = TicketTemplate(
            name = "Table Header Template",
            elements = listOf(
                TicketElement(
                    type = ElementType.TABLE_HEADER,
                    value = "Item             Qty     Price"
                )
            )
        )
        val ticketData = TicketData(
            ticketId = "101",
            tableName = "Table 4",
            roomName = "Kitchen",
            date = "2025-10-31",
            items = emptyList(),
            total = 0.0
        )
        val config = Config(
            restaurantName = "Ambrosia",
            address = null,
            phone = null,
            email = null,
            taxId = null,
            logo = null
        )

        val ticketFactory = TicketFactory(template)

        // Act
        ticketFactory.build(mockEscpos, ticketData, config)

        // Assert
        verify(mockEscpos).writeLF(any<Style>(), eq("Item             Qty     Price"))
    }

//     @Test
//     fun `build should apply bold style correctly`() {
//         // Arrange
//         val mockEscpos: EscPos = mock()
//         val styleCaptor = argumentCaptor<Style>()
//         val template = TicketTemplate(
//             name = "Bold Text Template",
//             elements = listOf(
//                 TicketElement(
//                     type = ElementType.TEXT,
//                     value = "Bold Text",
//                     style = ElementStyle(bold = true)
//                 )
//             )
//         )
//         val ticketData = TicketData(
//             ticketId = "102",
//             tableName = "Table 5",
//             roomName = "Dining",
//             date = "2025-10-31",
//             items = emptyList(),
//             total = 0.0
//         )
//         val config = Config(
//             restaurantName = "Ambrosia",
//             address = null,
//             phone = null,
//             email = null,
//             taxId = null,
//             logo = null
//         )

//         val ticketFactory = TicketFactory(template)

//         // Act
//         ticketFactory.build(mockEscpos, ticketData, config)

//         // Assert
//         verify(mockEscpos).writeLF(styleCaptor.capture(), eq("Bold Text"))
//         val capturedStyle = styleCaptor.firstValue
//         assertEquals(true, capturedStyle.isBold)
//     }
}
