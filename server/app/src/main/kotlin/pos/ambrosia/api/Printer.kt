package pos.ambrosia.api

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import pos.ambrosia.services.PrinterManager
import pos.ambrosia.models.TicketPrinter 
import pos.ambrosia.models.TicketType
import pos.ambrosia.models.SetPrinterRequest
import pos.ambrosia.models.PrintRequest


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
