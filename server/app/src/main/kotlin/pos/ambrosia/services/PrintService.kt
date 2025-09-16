package pos.ambrosia.services

import com.github.anastaciocintra.escpos.EscPos
import com.github.anastaciocintra.output.PrinterOutputStream
import java.io.IOException
import javax.print.PrintService
import pos.ambrosia.models.TicketPrinter
import pos.ambrosia.models.TicketType

object PrinterManager {
  private var kitchenPrinter: PrintService? = null
  private var customerPrinter: PrintService? = null

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

  fun printTicket(ticket: TicketPrinter, type: TicketType) {
    val printerService =
			when (type) {
				TicketType.KITCHEN -> kitchenPrinter
				TicketType.CUSTOMER -> customerPrinter
			} ?: throw IOException("Printer for type $type not configured.")

    try {
      val printerOutputStream = PrinterOutputStream(printerService)
      val escpos = EscPos(printerOutputStream)

      escpos.writeLF("--- INICIO TICKET ---")
      ticket.entries.forEach { entry ->
        escpos.writeLF("${entry.number}x ${entry.name}")
        if (entry.comments.isNotEmpty()) {
          entry.comments.forEach { comment -> escpos.writeLF("  - $comment") }
        }
      }
      escpos.writeLF("--- FIN TICKET ---")
      escpos.feed(5).cut(EscPos.CutMode.FULL)
      escpos.close()
    } catch (e: Exception) {
      throw IOException("Failed to print ticket: ${e.message}", e)
    }
  }
}
