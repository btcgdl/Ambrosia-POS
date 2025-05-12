package pos.ambrosia.utils

// Custom exceptions for specific error scenarios
class InvalidCredentialsException(message: String = "Credenciales inválidas") : IllegalArgumentException(message)
class UnauthorizedApiException(message: String = "Acceso a la API no autorizado") : SecurityException(message)