package pos.ambrosia.api

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import pos.ambrosia.models.PrintRequest
import pos.ambrosia.models.SetPrinterRequest
import pos.ambrosia.services.ConfigService
import pos.ambrosia.services.PrinterManager
import pos.ambrosia.db.DatabaseConnection
import pos.ambrosia.models.TicketData
import pos.ambrosia.models.TicketType

@kotlinx.serialization.Serializable
data class CustomPrintRequest(
    val templateName: String,
    val ticketData: TicketData,
    val type: TicketType
)

fun Application.configurePrinter() {
  
  routing { printer() }
}

fun Route.printer() {
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
        val configService = ConfigService(DatabaseConnection.getConnection())
        PrinterManager.printTicket(request.ticket, request.type, configService)
        call.respondText("Print job sent", status = HttpStatusCode.OK)
      } catch (e: Exception) {
        call.respondText(
                "Error printing: ${e.message}",
                status = HttpStatusCode.InternalServerError
        )
      }
    }
    post("/print-custom") {
        val request = call.receive<CustomPrintRequest>()
        val template = ticketTemplates[request.templateName]
        if (template == null) {
            call.respond(HttpStatusCode.NotFound, "Template '${request.templateName}' not found")
            return@post
        }

        try {
            val configService = ConfigService(DatabaseConnection.getConnection())
            PrinterManager.printCustomTicket(request.ticketData, template, request.type, configService)
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
