package pos.ambrosia.utils

import java.io.File
import java.security.MessageDigest
import java.security.SecureRandom
import java.util.*

/**
 * Service for generating secure seeds/passphrases similar to the install.sh script.
 * Uses Diceware methodology for generating cryptographically secure passphrases.
 */
class SeedGenerator (
    val NUM_WORDS: Int = 12,
    val CONFIG_DIR: String = ".Ambrosia-POS",
    val CONFIG_FILE: String = "ambrosia.conf"
) {

    /**
     * Loads the EFF large wordlist from the local file
     */
    private fun loadWordlist(): List<String> {
        // Try to find the wordlist file in the project scripts directory
        val projectRoot = System.getProperty("user.dir")
        val wordlistFile = File(projectRoot, "scripts/eff_large_wordlist.txt")
        
        if (!wordlistFile.exists()) {
            
            throw IllegalStateException("Wordlist file not found. Expected at: ${wordlistFile.absolutePath}")
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

}
