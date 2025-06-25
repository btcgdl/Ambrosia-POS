package pos.ambrosia.utils

// Custom exceptions for specific error scenarios
class InvalidCredentialsException(message: String = "Invalid credentials") :
        IllegalArgumentException(message)

class UnauthorizedApiException(message: String = "Unauthorized API access") :
        SecurityException(message)

class UserNotFoundException(message: String = "User not found") : IllegalArgumentException(message)

