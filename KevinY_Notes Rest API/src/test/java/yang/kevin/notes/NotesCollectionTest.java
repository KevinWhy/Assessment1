package yang.kevin.notes;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Test;
import org.springframework.http.MediaType;

/**
 * Test all actions on the Notes Collection endpoint (/api/tests/).
 * @author Kevin Yang
 *
 */
public class NotesCollectionTest extends BaseTest {
	// Tests for getting all notes ------------------------------------//
	@Test
	public void shouldGetAllNotes() throws Exception {
		expectNoChanges();
	}
	
	// Tests for case-insensitive filters ------------------------------------//
	@Test
	public void filterNotesWithApple() throws Exception {
		mockMvc.perform(get(BASE_ENDPOINT +"?query=apple"))
				.andExpect(status().isOk())
				.andExpect(content().json(  getNotesJsonFromDatabase(new Integer[] {1,2})  ));
	}
	@Test
	public void filterNotesWithP() throws Exception {
		mockMvc.perform(get(BASE_ENDPOINT +"?query=p"))
				.andExpect(status().isOk())
				.andExpect(content().json(  getNotesJsonFromDatabase(new Integer[] {1,2,6})  ));
	}
	@Test
	public void filterNoNotesFound() throws Exception {
		mockMvc.perform(get(BASE_ENDPOINT +"?query=SOME STRING THAT'S NOT IN NOTE!"))
				.andExpect(status().isOk())
				.andExpect(content().json("[]"));
	}

	// Tests for posting... ------------------------------------//
	@Test
	public void shouldPostNewNote() throws Exception {
		String postNoteJson = "{\"body\":\"A new note\"}";
		mockMvc.perform(post(BASE_ENDPOINT).content(postNoteJson).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isCreated());
		// Make sure new note is visible
		String newNoteJson = addIdToNoteJson(NEXT_ID, postNoteJson);
		mockMvc.perform(get(BASE_ENDPOINT+ NEXT_ID +"/"))
				.andExpect(status().isOk())
				.andExpect(content().json(newNoteJson));
		// Also check list of all notes
		String allJson = getNotesJsonFromDatabase(new Integer[] {1,2,4,5,6});
		allJson = allJson.substring(0, allJson.length() -1) +","+ newNoteJson +"]";
		mockMvc.perform(get(BASE_ENDPOINT))
				.andExpect(status().isOk())
				.andExpect(content().json(allJson));
	}
	@Test
	public void shouldPostEmptyNote() throws Exception {
		String postNoteJson = "{\"body\": \"\"}";
		mockMvc.perform(post(BASE_ENDPOINT).content(postNoteJson).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isCreated());
		// Make sure new note is visible
		String newNoteJson = addIdToNoteJson(NEXT_ID, postNoteJson);
		mockMvc.perform(get(BASE_ENDPOINT+ NEXT_ID +"/"))
				.andExpect(status().isOk())
				.andExpect(content().json(newNoteJson));
	}
	@Test
	public void shouldPostMaxLengthNote() throws Exception {
		String postNoteJson = "{\"body\": \"" +"q".repeat(MAX_LENGTH_NOTE) +"\"}";
		mockMvc.perform(post(BASE_ENDPOINT).content(postNoteJson).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isCreated());
		// Make sure new note is visible
		String newNoteJson = addIdToNoteJson(NEXT_ID, postNoteJson);
		mockMvc.perform(get(BASE_ENDPOINT+ NEXT_ID +"/"))
				.andExpect(status().isOk())
				.andExpect(content().json(newNoteJson));
	}
	
	@Test
	public void failPostingNullNote() throws Exception {
		String postNoteJson = "{\"body\": null}";
		mockMvc.perform(post(BASE_ENDPOINT).content(postNoteJson).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isBadRequest());
		mockMvc.perform(get(BASE_ENDPOINT+ NEXT_ID +"/"))
				.andExpect(status().isNotFound());
	}
	@Test
	public void failPostingTooLongNote() throws Exception {
		String postNoteJson = "{\"body\": \"" +"a".repeat(MAX_LENGTH_NOTE +1) +"\"}";
		mockMvc.perform(post(BASE_ENDPOINT).content(postNoteJson).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isBadRequest());
		mockMvc.perform(get(BASE_ENDPOINT+ NEXT_ID +"/"))
				.andExpect(status().isNotFound());
	}
}
