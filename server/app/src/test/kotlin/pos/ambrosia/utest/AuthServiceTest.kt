package pos.ambrosia.utest

import kotlinx.coroutines.runBlocking
import org.mockito.kotlin.*
import pos.ambrosia.models.AuthResponse
import pos.ambrosia.services.AuthService
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet
import kotlin.test.*

class AuthServiceTest {
    private val mockConnection: Connection = mock()
    private val mockStatement: PreparedStatement = mock()
    private val mockResultSet: ResultSet = mock()
    
}