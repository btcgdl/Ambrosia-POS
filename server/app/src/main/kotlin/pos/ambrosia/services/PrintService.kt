package pos.ambrosia.services

import com.github.anastaciocintra.escpos.EscPos
import com.github.anastaciocintra.output.PrinterOutputStream
import com.github.anastaciocintra.escpos.Style
import com.github.anastaciocintra.escpos.EscPosConst
import java.io.IOException
import javax.print.PrintService
import pos.ambrosia.models.TicketPrinter
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

  val bold = Style()
    .setBold(true)
  
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

      escpos.writeLF(title, "Example Restaurant");
      escpos.writeLF("Sucursal Lopez Cotilla 1520");
      escpos.writeLF("Col. Americana");
      escpos.writeLF("C.P. 44160. Gdl, Jal");
      escpos.writeLF("TEL (33) 3615 6173");
      escpos.writeLF("N_Mesa: " + 1 + "          " + "Fecha: " + "2024-10-10");
      escpos.writeLF("N_Sala: " + "Sala VIP");
      escpos.writeLF("N_ticket: " + "000123");
      escpos.feed(1);
      escpos.writeLF(bold,"Plato                     P.SubTotal  P.Total")
            .writeLF(bold,"---------------------------------------------");
      ticket.entries.forEach { entry ->
        escpos.writeLF("${entry.number}x ${entry.name}                  ${entry.cost}")
        if (entry.comments.isNotEmpty()) {
          entry.comments.forEach { comment -> escpos.writeLF("  - $comment") }
        }
      }
      escpos.writeLF(bold,"---------------------------------------------");
      escpos.writeLF(bold,"                              Total S/: " + 100.00);
      escpos.feed(5).cut(EscPos.CutMode.FULL)
      escpos.close()
    } catch (e: Exception) {
      throw IOException("Failed to print ticket: ${e.message}", e)
    }
  }
}
