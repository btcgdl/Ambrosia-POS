package pos.ambrosia.commands

import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.parameters.options.flag
import com.github.ajalt.clikt.parameters.options.option
import pos.ambrosia.utils.ConfigGenerator

/**
 * Command for generating secure seeds/passphrases for Ambrosia POS
 */
class GenerateSeedCommand : CliktCommand(
    name = "generate-seed"
) {
    
    private val autoYes by option("-y", "--yes", help = "Automatic yes to prompts; enables non-interactive mode")
        .flag(default = false)
    
    private val showPassphrase by option("--show-passphrase", help = "Show the raw passphrase (not recommended for production)")
        .flag(default = false)

    override fun run() {
        val seedGen = ConfigGenerator
        
        echo("Generating secure seed using Diceware methodology...")
        echo("Loading EFF wordlist...")

        try {
            val seedResult = seedGen.generateSeed()
            
            // Display results
            echo("")
            if (showPassphrase || !autoYes) {
                echo("API passphrase:")
                echo(seedResult.passphrase)
                echo("")
            }
            
            echo("Token hash (SHA-256):")
            echo(seedResult.sha256Hash)
            echo("")
            
            echo("Token base64:")
            echo(seedResult.base64Token)
            echo("")
            
            if (!showPassphrase && autoYes) {
                echo("Raw passphrase not shown in non-interactive mode for security.")
                echo("Use --show-passphrase flag if you need to see it.")
                echo("")
            }
            
            // Save configuration
            val shouldSave = if (autoYes) {
                true
            } else {
                echo("Do you want to save the hash and base64 to ambrosia.conf? [Y/n]: ", trailingNewline = false)
                val input = readLine()?.trim() ?: "y"
                input.isEmpty() || input.lowercase().startsWith("y")
            }
            
            if (shouldSave) {
                val saved = seedGen.saveConfig(seedResult, overwrite = autoYes)
                if (!saved && !autoYes) {
                    echo("Do you want to overwrite the existing configuration? [Y/n]: ", trailingNewline = false)
                    val overwrite = readLine()?.trim()?.lowercase()?.startsWith("y") ?: false
                    if (overwrite) {
                        seedGen.saveConfig(seedResult, overwrite = true)
                    } else {
                        echo("Exiting without saving.")
                        return
                    }
                }
                
                // Ensure database exists
                echo("")
                echo("Checking database...")
                seedGen.ensureDatabase()
                
            } else {
                echo("Exiting without saving.")
            }
            
            echo("")
            echo("Seed generation complete!")
            
        } catch (e: Exception) {
            echo("Error generating seed: ${e.message}", err = true)
            throw e
        }
    }
}
