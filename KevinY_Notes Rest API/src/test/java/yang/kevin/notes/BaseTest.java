package yang.kevin.notes;

import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.Sql.ExecutionPhase;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

/**
 * This class defines the configuration used by all the tests.
 * @author oKevi
 *
 */

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase // Don't use a config's database
@Sql(executionPhase=ExecutionPhase.BEFORE_TEST_METHOD,scripts="classpath:test.sql") // Reset database with this SQL @ each test
public abstract class BaseTest {
	@Autowired
	protected MockMvc mockMvc;
}
