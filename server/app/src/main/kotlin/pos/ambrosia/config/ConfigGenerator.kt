package pos.ambrosia.utils

import java.io.File
import java.security.MessageDigest
import java.security.SecureRandom
import java.util.*

/**
 * Service for generating secure seeds/passphrases similar to the install.sh script.
 * Uses Diceware methodology for generating cryptographically secure passphrases.
 */
object ConfigGenerator {
    private const val NUM_WORDS = 6
    private const val CONFIG_DIR = ".Ambrosia-POS"
    private const val CONFIG_FILE = "ambrosia.conf"
    private const val DB_FILE = "ambrosia.db"

    data class SeedResult(
        val passphrase: String,
        val sha256Hash: String,
        val base64Token: String
    )

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
     * Generates a secure passphrase using Diceware methodology
     */
    fun generateSeed(): SeedResult {
        val wordlist = loadWordlist()
        
        // Generate passphrase
        val words = mutableListOf<String>()
        repeat(NUM_WORDS) {
            val roll = generateDiceRoll()
            // Find word that starts with the roll number
            val word = wordlist.find { line -> 
                line.startsWith(roll) 
            }?.split("\t")?.getOrNull(1)
            
            if (word != null) {
                words.add(word)
            } else {
                // Fallback: use a random word if dice roll doesn't match
                val randomLine = wordlist.random()
                val randomWord = randomLine.split("\t").getOrNull(1) ?: "fallback"
                words.add(randomWord)
            }
        }
        
        val passphrase = words.joinToString(" ")
        
        // Generate SHA-256 hash
        val digest = MessageDigest.getInstance("SHA-256")
        val hashBytes = digest.digest(passphrase.toByteArray())
        val sha256Hash = hashBytes.joinToString("") { "%02x".format(it) }
        
        // Generate Base64 encoding
        val base64Token = Base64.getEncoder().encodeToString(passphrase.toByteArray())
        
        return SeedResult(passphrase, sha256Hash, base64Token)
    }

    /**
     * Saves the configuration to the ambrosia.conf file
     */
    fun saveConfig(seedResult: SeedResult, overwrite: Boolean = false): Boolean {
        val userHome = System.getProperty("user.home")
        val configDir = File(userHome, CONFIG_DIR)
        val configFile = File(configDir, CONFIG_FILE)

        // Create directory if it doesn't exist
        if (!configDir.exists()) {
            configDir.mkdirs()
            println("Created directory ${configDir.absolutePath}")
        }

        // Check if file exists and handle overwrite
        if (configFile.exists() && !overwrite) {
            println("Configuration file already exists at ${configFile.absolutePath}")
            return false
        }

        try {
            // Write configuration
            configFile.writeText("""
                TOKEN_HASH=${seedResult.sha256Hash}
                TOKEN_BASE64=${seedResult.base64Token}
            """.trimIndent())
            
            println("Configuration saved to ${configFile.absolutePath}")
            return true
        } catch (e: Exception) {
            println("Error saving configuration: ${e.message}")
            return false
        }
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
