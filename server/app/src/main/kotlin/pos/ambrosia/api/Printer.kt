// server/app/src/main/kotlin/pos/ambrosia/api/Printer.kt

package pos.ambrosia.api

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import pos.ambrosia.services.PrinterManager
import pos.ambrosia.services.TicketType
import pos.ambrosia.util.Ticket // Importa tu clase Ticket

// Define una clase para recibir los datos del POST
@kotlinx.serialization.Serializable
data class PrintRequest(val ticket: Ticket, val type: TicketType)

@kotlinx.serialization.Serializable
data class SetPrinterRequest(val type: TicketType, val printerName: String)

fun Application.configurePrinter() {
  routing {
    route("/printers") {
      get { call.respond(PrinterManager.getAvailablePrinters()) }
      post("/set") {
        val request = call.receive<SetPrinterRequest>()

        PrinterManager.setPrinter(request.type, request.printerName)
        call.respondText(
					"Printer ${request.printerName} set for ${request.type}",
					status = HttpStatusCode.OK
        )
      }
      post("/print") {
        val request = call.receive<PrintRequest>()
        try {
          PrinterManager.printTicket(request.ticket, request.type)
          call.respondText("Print job sent", status = HttpStatusCode.OK)
        } catch (e: Exception) {
          call.respondText(
						"Error printing: ${e.message}",
						status = HttpStatusCode.InternalServerError
          )
        }
      }
    }
  }
}
