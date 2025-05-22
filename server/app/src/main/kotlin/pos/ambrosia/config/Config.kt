package pos.ambrosia.config

import java.io.File
import java.io.FileInputStream
import java.util.Properties
import org.slf4j.LoggerFactory

// Object to load and hold custom configuration
object AppConfig {
    private val logger = LoggerFactory.getLogger("pos.ambrosia.App")
    private val properties = Properties()
    private const val CONFIG_FILE_PATH = ".Ambrosia-POS/ambrosia.conf" // Relative to user\'s home directory

    fun loadConfig() {
        val userHome = System.getProperty("user.home")
        val configFile = File(userHome, CONFIG_FILE_PATH)

        try {
            FileInputStream(configFile).use { fis ->
                properties.load(fis)
            }
            logger.info("Configuration loaded from {}", configFile)
        } catch (e: Exception) {
            logger.error("Error loading configuration from {}", configFile)
            // Fallback or default values can be set here if needed
        }
    }

    fun getProperty(key: String, defaultValue: String? = null): String? {
        return properties.getProperty(key) ?: defaultValue
    }
}