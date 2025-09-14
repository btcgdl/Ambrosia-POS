package pos.ambrosia.api

import io.ktor.server.application.*
import io.ktor.server.routing.*
import io.ktor.server.response.*
import com.github.anastaciocintra.escpos.EscPos
import com.github.anastaciocintra.output.PrinterOutputStream
import io.ktor.http.*

fun Application.configurePrinter() {
    routing {
        route("/printers") {
            get {
                // respond health check
                call.respondText("Printer API is running", ContentType.Text.Plain, HttpStatusCode.OK)
            }
            post("/set") {
                // TODO: Implement printer settings endpoint
            }
            post("/print") {
                val printService = PrinterOutputStream.getPrintServiceByName("xt8769")
                val printerOutputStream = PrinterOutputStream(printService)
                val escpos = EscPos(printerOutputStream)
                escpos.writeLF("Hello world")
                escpos.feed(5).cut(EscPos.CutMode.FULL)
                escpos.close()
                call.respondText("Print job sent", ContentType.Text.Plain, HttpStatusCode.OK)
            }
        }
    }
}