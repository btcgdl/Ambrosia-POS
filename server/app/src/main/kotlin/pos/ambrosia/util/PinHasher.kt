package pos.ambrosia.utils

import io.ktor.utils.io.core.toByteArray
import java.security.MessageDigest
import java.util.Base64
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec
import pos.ambrosia.config.AppConfig

object SecurePinProcessor {
    private fun getAppMasterKey(): ByteArray {
        val keyString = AppConfig.getProperty("TOKEN_HASH")
        if (keyString.isNullOrBlank()) {
            throw IllegalStateException(
                    "TOKEN_HASH (App Master Key) not found in configuration or is empty. Cannot proceed securely."
            )
        }
        val keyBytes = keyString.toByteArray(Charsets.UTF_8)
        return keyBytes
    }

    private val HASH_ALGORITHM = "PBKDF2WithHmacSHA256"
    private const val ITERATION_COUNT = 10000
    private const val KEY_LENGTH = 256

    fun hashPinForStorage(pin: CharArray, userName: String): ByteArray {
        try {
            val appMasterKey = getAppMasterKey()
            if (appMasterKey.isEmpty()) {
                throw IllegalStateException("App Master Key no cargada o está vacía.")
            }

            val combinedSalt = (appMasterKey.plus(userName.toByteArray(Charsets.UTF_8)))

            val spec = PBEKeySpec(pin, combinedSalt, ITERATION_COUNT, KEY_LENGTH)
            val factory = SecretKeyFactory.getInstance(HASH_ALGORITHM)
            val hash = factory.generateSecret(spec).encoded

            pin.fill('\u0000')
            return hash
        } catch (e: Exception) {
            throw RuntimeException("Error al hashear el PIN con la clave maestra", e)
        }
    }
    fun verifyPin(enteredPin: CharArray, userName: String, storedHash: ByteArray): Boolean {
        val newHash = hashPinForStorage(enteredPin, userName)
        return MessageDigest.isEqual(newHash, storedHash)
    }

    fun byteArrayToBase64(byteArray: ByteArray): String =
            Base64.getEncoder().encodeToString(byteArray)
    fun base64ToByteArray(base64String: String): ByteArray =
            Base64.getDecoder().decode(base64String)
}
