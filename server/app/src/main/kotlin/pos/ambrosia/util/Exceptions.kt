package pos.ambrosia.utils

// Custom exceptions for specific error scenarios
class InvalidCredentialsException(message: String = "Invalid credentials") :
        IllegalArgumentException(message)

class UnauthorizedApiException(message: String = "Unauthorized API access") :
        SecurityException(message)

class UserNotFoundException(message: String = "User not found") : IllegalArgumentException(message)

// Phoenix Lightning node exceptions
class PhoenixConnectionException(message: String = "Unable to connect to Phoenix Lightning node") :
        RuntimeException(message)

class PhoenixNodeInfoException(message: String = "Failed to retrieve node information from Phoenix") :
        RuntimeException(message)

class PhoenixBalanceException(message: String = "Failed to retrieve balance information from Phoenix") :
        RuntimeException(message)

class PhoenixServiceException(message: String = "Phoenix Lightning node service error") :
        RuntimeException(message)

