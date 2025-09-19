package pos.ambrosia.services

import com.github.anastaciocintra.escpos.EscPos
import com.github.anastaciocintra.output.PrinterOutputStream
import com.github.anastaciocintra.escpos.Style
import com.github.anastaciocintra.escpos.EscPosConst
import java.io.IOException
import javax.print.PrintService
import pos.ambrosia.models.TicketData
import pos.ambrosia.models.TicketPrinter
import pos.ambrosia.models.TicketTemplate
import pos.ambrosia.models.TicketType

object PrinterManager {
  private var kitchenPrinter: PrintService? = null
  private var customerPrinter: PrintService? = null

  val title = Style()
    .setFontSize(Style.FontSize.`_3`, Style.FontSize.`_2`)
    .setJustification(EscPosConst.Justification.Center)

  val subtitle = Style()
    .setFontSize(Style.FontSize.`_2`, Style.FontSize.`_1`)
    .setJustification(EscPosConst.Justification.Center)

  val bold = Style().setBold(true)

  fun getAvailablePrinters(): Array<String> {
    return PrinterOutputStream.getListPrintServicesNames()
  }

  fun setPrinter(type: TicketType, printerName: String) {
    val printService = PrinterOutputStream.getPrintServiceByName(printerName)
    when (type) {
      TicketType.KITCHEN -> kitchenPrinter = printService
      TicketType.CUSTOMER -> customerPrinter = printService
    }
  }

  suspend fun printCustomTicket(
      ticketData: TicketData,
      template: TicketTemplate,
      type: TicketType,
      configService: ConfigService
  ) {
    val printerService =
        when (type) {
            TicketType.KITCHEN -> kitchenPrinter
            TicketType.CUSTOMER -> customerPrinter
        } ?: throw IOException("Printer for type $type not configured.")

    try {
        val printerOutputStream = PrinterOutputStream(printerService)
        val escpos = EscPos(printerOutputStream)
        val config = configService.getConfig()

        val ticketFactory = TicketFactory(template)
        ticketFactory.build(escpos, ticketData, config)

        escpos.feed(5).cut(EscPos.CutMode.FULL)
        escpos.close()
    } catch (e: Exception) {
        throw IOException("Failed to print ticket: ${e.message}", e)
    }
  }

  suspend fun printTicket(ticket: TicketPrinter, type: TicketType, configService: ConfigService) {
    val printerService =
      when (type) {
        TicketType.KITCHEN -> kitchenPrinter
        TicketType.CUSTOMER -> customerPrinter
      }
              ?: throw IOException("Printer for type $type not configured.")

    try {
      val printerOutputStream = PrinterOutputStream(printerService)
      val escpos = EscPos(printerOutputStream)
      val config = configService.getConfig()

      if (config != null) {
        escpos.writeLF(title, config.restaurantName)
        config.address?.let { escpos.writeLF(it) }
        config.phone?.let { escpos.writeLF("TEL $it") }
      }

      escpos.writeLF("N_Mesa: " + 1 + "          " + "Fecha: " + "2024-10-10")
      escpos.writeLF("N_Sala: " + "Sala VIP")
      escpos.writeLF("N_ticket: " + "000123")
      escpos.feed(1)
      escpos.writeLF(bold, "Plato                     P.SubTotal  P.Total")
      escpos.writeLF(bold, "---------------------------------------------")

      ticket.entries.forEach { entry ->
        escpos.writeLF("${entry.number}x ${entry.name}                  ${entry.cost}")
        if (entry.comments.isNotEmpty()) {
          entry.comments.forEach { comment -> escpos.writeLF("  - $comment") }
        }
      }

      escpos.writeLF(bold, "---------------------------------------------")
      escpos.writeLF(bold, "                              Total S/: " + 100.00)
      escpos.feed(5).cut(EscPos.CutMode.FULL)
      escpos.close()
    } catch (e: Exception) {
      throw IOException("Failed to print ticket: ${e.message}", e)
    }
  }
}
