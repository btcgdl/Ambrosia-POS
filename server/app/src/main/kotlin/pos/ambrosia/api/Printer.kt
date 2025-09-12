package pos.ambrosia.api
import io.ktor.server.routing.*
import com.github.anastaciocintra.escpos.EscPos
import com.github.anastaciocintra.output.PrinterOutputStream
import io.ktor.http.*

fun Route.configurePrinter() {
    route("/printers") {
        get {
            val printServices = PrinterOutputStream.getListPrintServicesNames().toList()
            // call.respond(HttpStatusCode.OK, printServices)
        }
        post("/set") {
            // TODO: Implement printer settings endpoint
        }
        post("/print") {
            val printService = PrinterOutputStream.getPrintServiceByName("Your_Printer_Name_Here")
            val printerOutputStream = PrinterOutputStream(printService)
            val escpos = EscPos(printerOutputStream)
            escpos.writeLF("Hello world")
            escpos.feed(5).cut(EscPos.CutMode.FULL)
            escpos.close()
        }
    }
}