package yang.kevin.notes;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.HashMap;
import java.util.Map;

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
 * @author Kevin Yang
 *
 */

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase // Don't use a config's database
@Sql(executionPhase=ExecutionPhase.BEFORE_TEST_METHOD,scripts="classpath:test.sql") // Reset database with this SQL @ each test
public abstract class BaseTest {
	protected static final String BASE_ENDPOINT = "/api/notes/";
	protected static final int MAX_LENGTH_NOTE = 255; // Limit from Notes Entity
	protected static final int NEXT_ID = 7; // The AUTO_INCREMENT from test.sql

	// Make JSON for each element in test database
	private static final Map<Integer, String> notesJson = new HashMap<>();
	static {
		notesJson.put(1, "{\"id\":1,\"body\":\"THIS IS AN APPLE TEST\"}");
		notesJson.put(2, "{\"id\":2,\"body\":\"Quench aPPLe Slam\"}");
		notesJson.put(4, "{\"id\":4,\"body\":\"Milk\"}");
		notesJson.put(5, "{\"id\":5,\"body\":\"milk tea\"}");
		notesJson.put(6, "{\"id\":6,\"body\":\"Printing Parchment\"}");
	}
	
	@Autowired
	protected MockMvc mockMvc;

	/**
	 * Figures out what the JSON would look like for the specified note.
	 * @param id The note to get JSON for
	 * @return JSON that describes the specified note
	 */
	protected static String getNoteJsonFromDatabase(Integer id) {
		return notesJson.get(id);
	}

	/**
	 * Figures out what the JSON would look like for the specified notes.
	 * Assumes that the ids are valid.
	 * @param ids A list of all the notes' ids that should be returned.
	 * @return JSON that describes the notes
	 */
	protected static String getNotesJsonFromDatabase(Integer[] ids) {
		// Return the elements that test wanted
		String result = "";
		for (Integer id : ids) {
			if (result.length() > 0)
				result += ",";
			result += notesJson.get(id);
		}
		return "["+ result +"]";
	}

	/**
	 * Given some JSON that's posted to the server & the expectedId,
	 * return how the note's total JSON should look.
	 * 
	 * @param expectedId Id that the Note should have
	 * @param postJson What was/will be posted to the server.
	 * @return The note's entire expected JSON
	 */
	protected static String addIdToNoteJson(int expectedId, String noteJson) {
		return "{\"id\":"+ expectedId +","+ noteJson.substring(1);
	}
	
	// Helper Test Function -------------------------------/
	/**
	 * Runs a test to see if any of the data has changed.
	 * @throws Exception
	 */
	protected void expectNoChanges() throws Exception {
		mockMvc.perform(get(BASE_ENDPOINT))
				.andExpect(status().isOk())
				.andExpect(content().json(  getNotesJsonFromDatabase(new Integer[] {1,2,4,5,6})  ));
	}
}
