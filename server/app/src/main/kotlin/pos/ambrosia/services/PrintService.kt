package pos.ambrosia.services

import com.github.anastaciocintra.escpos.EscPos
import com.github.anastaciocintra.escpos.EscPosConst
import com.github.anastaciocintra.escpos.Style
import com.github.anastaciocintra.output.PrinterOutputStream
import java.io.IOException
import javax.print.PrintService
import pos.ambrosia.models.DefaultTemplates
import pos.ambrosia.models.TicketData
import pos.ambrosia.models.TicketDataItem
import pos.ambrosia.models.TicketTemplate
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

  suspend fun printTicket(
          ticketData: TicketData,
          template: TicketTemplate,
          type: TicketType,
          configService: ConfigService
  ) {
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

      val ticketFactory = TicketFactory(template)
      ticketFactory.build(escpos, ticketData, config)

      escpos.feed(5).cut(EscPos.CutMode.FULL)
      escpos.close()
    } catch (e: Exception) {
      throw IOException("Failed to print ticket: ${e.message}", e)
    }
  }
}
