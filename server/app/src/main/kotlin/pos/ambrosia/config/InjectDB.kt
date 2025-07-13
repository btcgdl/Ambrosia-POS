package pos.ambrosia.utils
import java.io.File

class InjectDB (
    val datadir: String,
    val dbfile: String = "ambrosia.db"
){
    /**
     * Copies the database file from the project directory if it doesn't exist in config
     */
    fun ensureDatabase(): Boolean {

        val dbFile = File(datadir, dbfile)

        if (dbFile.exists()) {
            return true
        }

        try {
            // Try to find the database file in the project db directory
            val projectRoot = File(System.getProperty("user.dir")).parentFile.parentFile
            val sourceDbFile = File(projectRoot, "db/ambrosia.db")
            
            if (!sourceDbFile.exists()) {
                
                throw IllegalStateException("Database file not found. Expected at: ${sourceDbFile.absolutePath}")

            } else {
                sourceDbFile.copyTo(dbFile)
            }
            
            println("Database copied to ${dbFile.absolutePath}")
            return true
        } catch (e: Exception) {
            println("Error copying database: ${e.message}")
            return false
        }
    }
}
