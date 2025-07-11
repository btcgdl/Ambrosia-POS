package pos.ambrosia.utils

import java.io.File
import java.security.MessageDigest
import java.security.SecureRandom
import java.util.*

/**
 * Service for generating secure seeds/passphrases similar to the install.sh script.
 * Uses Diceware methodology for generating cryptographically secure passphrases.
 */
class ConfigGenerator (
    val NUM_WORDS: Int = 6,
    val CONFIG_DIR: String = ".Ambrosia-POS",
    val CONFIG_FILE: String = "ambrosia.conf",
    val DB_FILE: String = "ambrosia.db"
) {

    /**
     * Loads the EFF large wordlist from the local file
     */
    private fun loadWordlist(): List<String> {
        // Try to find the wordlist file in the project scripts directory
        val projectRoot = System.getProperty("user.dir")
        val wordlistFile = File(projectRoot, "scripts/eff_large_wordlist.txt")
        
        if (!wordlistFile.exists()) {
            // Fallback: try relative to the current working directory
            val fallbackFile = File("scripts/eff_large_wordlist.txt")
            if (!fallbackFile.exists()) {
                throw IllegalStateException("Wordlist file not found. Expected at: ${wordlistFile.absolutePath}")
            }
            return fallbackFile.readText().lines()
                .filter { it.isNotBlank() }
        }
        
        return wordlistFile.readText().lines()
            .filter { it.isNotBlank() }
    }

    /**
     * Generates a dice roll (5 digits, each 1-6) for Diceware
     */
    private fun generateDiceRoll(): String {
        val random = SecureRandom()
        return (1..5).map { (random.nextInt(6) + 1).toString() }.joinToString("")
    }

    /**
     * Gets a word from the wordlist using a dice roll
     */
    private fun getWordFromRoll(wordlist: List<String>, roll: String): String? {
        return wordlist.find { it.startsWith(roll) }?.substringAfter("\t")
    }

    /**
     * Copies the database file from the project directory if it doesn't exist in config
     */
    fun ensureDatabase(): Boolean {
        val userHome = System.getProperty("user.home")
        val configDir = File(userHome, CONFIG_DIR)
        val dbFile = File(configDir, DB_FILE)

        if (dbFile.exists()) {
            println("Database already exists at ${dbFile.absolutePath}")
            return true
        }

        try {
            // Try to find the database file in the project db directory
            val projectRoot = System.getProperty("user.dir")
            val sourceDbFile = File(projectRoot, "db/ambrosia.db")
            
            if (!sourceDbFile.exists()) {
                // Fallback: try relative to the current working directory
                val fallbackDbFile = File("db/ambrosia.db")
                if (!fallbackDbFile.exists()) {
                    throw IllegalStateException("Database file not found. Expected at: ${sourceDbFile.absolutePath}")
                }
                fallbackDbFile.copyTo(dbFile)
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
