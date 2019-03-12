package yang.kevin.notes;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.HashMap;
import java.util.Map;

import org.junit.Test;
import org.springframework.http.MediaType;

/**
 * Test all actions on the Notes Collection endpoint.
 * @author oKevi
 *
 */
public class NotesCollectionTest extends BaseTest {
//	private static int MAX_LENGTH_NOTE = 255;
	private static int NEXT_ID = 7;
	
	/**
	 * Figures out what the JSON would look like for the specified notes.
	 * @param ids A list of all the notes' ids that should be returned.
	 * @return JSON that describes the notes
	 */
	private String getNotesJsonFromDatabase(Integer[] ids) {
		// Make JSON for each element in test database
		Map<Integer, String> notesJson = new HashMap<>();
		notesJson.put(1, "{\"id\":1,\"body\":\"THIS IS AN APPLE TEST\"}");
		notesJson.put(2, "{\"id\":2,\"body\":\"Quench aPPLe Slam\"}");
		notesJson.put(4, "{\"id\":4,\"body\":\"Milk\"}");
		notesJson.put(5, "{\"id\":5,\"body\":\"milk tea\"}");
		notesJson.put(6, "{\"id\":6,\"body\":\"Printing Parchment\"}");
		// Return the elements that test wanted
		String result = "";
		for (Integer id : ids) {
			if (result.length() > 0)
				result += ",";
			result += notesJson.get(id);
		}
		return "["+ result +"]";
	}

	// Tests for all notes ------------------------------------//
	@Test
	public void shouldGetAllNotes() throws Exception {
		System.out.println("ALL NOTES");
		mockMvc.perform(get("/api/notes/"))
				.andExpect(status().isOk())
				.andExpect(content().json(  getNotesJsonFromDatabase(new Integer[] {1,2,4,5,6})  ))
				.andDo(print());
	}
	
	// Tests for case-insensitive filters ------------------------------------//
	@Test
	public void filterNotesWithApple() throws Exception {
		mockMvc.perform(get("/api/notes/?query=apple"))
		.andExpect(status().isOk())
		.andExpect(content().json(  getNotesJsonFromDatabase(new Integer[] {1,2})  ));
	}
	@Test
	public void filterNotesWithP() throws Exception {
		mockMvc.perform(get("/api/notes/?query=p"))
				.andExpect(status().isOk())
				.andExpect(content().json(  getNotesJsonFromDatabase(new Integer[] {1,2,6})  ));
	}

	// Tests for posting... ------------------------------------//
	/**
	 * Given the posted JSON & the expectedId, return how the new note's JSON should look.
	 * @param expectedId Id that the new Note should get
	 * @param postJson What was posted to the server.
	 * @return New note's final JSON
	 */
	private String buildNewNoteJson(int expectedId, String postJson) {
		return "{\"id\":"+ expectedId +","+ postJson.substring(1);
	}
	
	@Test
	public void shouldPostNewNote() throws Exception {
		String postNoteJson = "{\"body\":\"A new note\"}";
		mockMvc.perform(post("/api/notes/").content(postNoteJson).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isCreated());
		// Make sure new note is visible
		String newNoteJson = buildNewNoteJson(NEXT_ID, postNoteJson);
		String allJson = getNotesJsonFromDatabase(new Integer[] {1,2,4,5,6});
		allJson = allJson.substring(0, allJson.length() -1) +","+ newNoteJson +"]";
		System.out.println("NEW NOTE TEST");
		mockMvc.perform(get("/api/notes/"))
				.andExpect(status().isOk())
				.andDo(print()) // DEBUG
				.andExpect(content().json(allJson));
		mockMvc.perform(get("/api/notes/"+ NEXT_ID +"/"))
				.andExpect(status().isOk())
				.andExpect(content().json(newNoteJson));
	}
	@Test
	public void shouldPostEmptyNote() throws Exception {
		String postNoteJson = "{\"body\": \"\"}";
		mockMvc.perform(post("/api/notes/").content(postNoteJson).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isCreated());
		// Make sure new note is visible
		System.out.println("EMPTY NOTE TEST");
		String newNoteJson = buildNewNoteJson(NEXT_ID, postNoteJson);
		mockMvc.perform(get("/api/notes/"))
				.andDo(print()); // DEBUG

		mockMvc.perform(get("/api/notes/"+ NEXT_ID +"/"))
				.andExpect(status().isOk())
				.andExpect(content().json(newNoteJson));
	}
	@Test
	public void shouldFailPostNullNote() throws Exception {
		String postNoteJson = "{\"body\": null}";
		mockMvc.perform(post("/api/notes/").content(postNoteJson).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isBadRequest());
		mockMvc.perform(get("/api/notes/"+ NEXT_ID +"/"))
				.andExpect(status().isNotFound());
	}
}
