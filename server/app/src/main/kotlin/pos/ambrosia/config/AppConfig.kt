package pos.ambrosia.config

import java.io.File
import java.io.FileInputStream
import java.util.Properties
import pos.ambrosia.logger

/**
 * Application configuration manager.
 * Loads properties from a configuration file and provides access to them.
 */

object AppConfig {

    private val properties = Properties()
    private val phoenixProperties = Properties()
    private const val CONFIG_FILE_PATH = ".Ambrosia-POS/ambrosia.conf"
    private const val PHOENIX_PATH = ".phoenix/phoenix.conf" 

    fun loadConfig() {
        val userHome = System.getProperty("user.home")
        val configFile = File(userHome, CONFIG_FILE_PATH)
        val phoenixFile = File(userHome, PHOENIX_PATH)

        try {
            FileInputStream(configFile).use { fis ->
                properties.load(fis)
            }
            logger.info("Configuration loaded from {}", configFile)
        } catch (e: Exception) {
            logger.error("Error loading configuration from {}", configFile)
        }

        try {
            FileInputStream(phoenixFile).use { fis ->
                phoenixProperties.load(fis)
            }
            logger.info("Phoenix configuration loaded from {}", phoenixFile)
        } catch (e: Exception) {
            logger.error("Error loading Phoenix configuration from {}", phoenixFile)
        }
    }

    fun getProperty(key: String, defaultValue: String? = null): String? {
        return properties.getProperty(key) ?: defaultValue
    }
    
    fun getPhoenixProperty(key: String, defaultValue: String? = null): String? {
        return phoenixProperties.getProperty(key) ?: defaultValue
    }
}