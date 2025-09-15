// server/app/src/main/kotlin/pos/ambrosia/services/PrintService.kt

package pos.ambrosia.services

import com.github.anastaciocintra.escpos.EscPos
import com.github.anastaciocintra.escpos.EscPosConst
import com.github.anastaciocintra.output.PrinterOutputStream
import pos.ambrosia.util.Ticket // Asegúrate de importar tu clase Ticket
import java.io.IOException
import javax.print.PrintService

enum class TicketType {
    KITCHEN, CUSTOMER
}

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

    fun printTicket(ticket: Ticket, type: TicketType) {
        val printerService = when (type) {
            TicketType.KITCHEN -> kitchenPrinter
            TicketType.CUSTOMER -> customerPrinter
        } ?: throw IOException("Printer for type $type not configured.")

        try {
            val printerOutputStream = PrinterOutputStream(printerService)
            val escpos = EscPos(printerOutputStream)
            
            // Aquí va la lógica para formatear y escribir el ticket
            // Ejemplo básico:
            escpos.writeLF("--- INICIO TICKET ---")
            ticket.entries.forEach { entry ->
                escpos.writeLF("${entry.number}x ${entry.name}")
                if (entry.comments.isNotEmpty()) {
                    entry.comments.forEach { comment ->
                        escpos.writeLF("  - $comment")
                    }
                }
            }
            escpos.writeLF("--- FIN TICKET ---")
            escpos.feed(5).cut(EscPos.CutMode.FULL)
            escpos.close()
        } catch (e: Exception) {
            // Manejar errores como impresora no encontrada, etc.
            throw IOException("Failed to print ticket: ${e.message}", e)
        }
    }
}