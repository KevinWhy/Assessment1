package yang.kevin.notes;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.http.MediaType;

/**
 * Test all actions on the notes' specific endpoints (/api/tests/{id}/).
 * @author Kevin Yang
 *
 */
public class SpecificNoteTest extends BaseTest {
	// Tests for getting data... ------------------------------------//
	@Test
	public void shouldGetNote() throws Exception {
		mockMvc.perform(get(BASE_ENDPOINT +"1/"))
				.andExpect(status().isOk())
				.andExpect(content().json(  getNoteJsonFromDatabase(1)  ));
	}
	@Test
	public void failGetingMissingNote() throws Exception {
		mockMvc.perform(get(BASE_ENDPOINT +"100/"))
				.andExpect(status().isNotFound());
	}

	// Tests for PUTTING data... ------------------------------------//
	@Test
	public void shouldReplaceNote() throws Exception {
		String originalNote = getNoteJsonFromDatabase(5);
		String postJson = "{\"body\":\"THIS IS SOMETHING ELSE\"}";
		String finalNoteJson = addIdToNoteJson(5, postJson);
		// First, check data =/= end result
		Assert.assertNotEquals(originalNote, finalNoteJson);
		mockMvc.perform(get(BASE_ENDPOINT +"5/"))
				.andExpect(status().isOk())
				.andExpect(content().json(originalNote));
		// Then, change data & see if it actually changed
		mockMvc.perform(put(BASE_ENDPOINT +"5/").content(postJson).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().json(finalNoteJson));
		// Also, make sure output == GET output
		mockMvc.perform(get(BASE_ENDPOINT +"5/"))
				.andExpect(status().isOk())
					.andExpect(content().json(finalNoteJson));
		// Finally, check list of all notes
		String allJson = getNotesJsonFromDatabase(new Integer[] {1,2,4,6});
		allJson = allJson.substring(0, allJson.length() -1) +","+ finalNoteJson +"]";
		mockMvc.perform(get(BASE_ENDPOINT +""))
				.andExpect(status().isOk())
				.andExpect(content().json(allJson));
	}
	@Test
	public void shouldReplaceMaxLengthNote() throws Exception {
		String postJson = "{\"body\": \"" +"a".repeat(MAX_LENGTH_NOTE) +"\"}";
		String finalNoteJson = addIdToNoteJson(5, postJson);
		mockMvc.perform(put(BASE_ENDPOINT +"5/").content(postJson).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().json(finalNoteJson));
	}
	
	@Test
	public void failReplacingMissingNote() throws Exception {
		String postJson = "{\"body\":\"THIS IS SOMETHING ELSE\"}";
		mockMvc.perform(put(BASE_ENDPOINT +"99/").content(postJson).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isNotFound());
		expectNoChanges(); // Make sure there's no changes to data
	}
	@Test
	public void failReplacingBadFormat() throws Exception {
		String postJson = "{\"BODY_ZZZ\":\"THIS IS SOMETHING ELSE\"}";
		mockMvc.perform(put(BASE_ENDPOINT +"5/").content(postJson).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isBadRequest());
		expectNoChanges(); // Make sure there's no changes to data
	}
	@Test
	public void failReplacingTooLongNote() throws Exception {
		String postJson = "{\"body\": \"" +"a".repeat(MAX_LENGTH_NOTE +1) +"\"}";
		mockMvc.perform(put(BASE_ENDPOINT +"5/").content(postJson).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isBadRequest());
		expectNoChanges(); // Make sure there's no changes to data
	}

	// Tests for patching. ------------------------------------//
	// Tests look very similar, but PATCH might act very differently from PUT... so test it all.
	@Test
	public void shouldUpdateNote() throws Exception {
		String originalNote = getNoteJsonFromDatabase(5);
		String postJson = "{\"body\":\"THIS IS SOMETHING ELSE\"}";
		String finalNoteJson = addIdToNoteJson(5, postJson);
		// First, check data =/= end result
		Assert.assertNotEquals(originalNote, finalNoteJson);
		mockMvc.perform(get(BASE_ENDPOINT +"5/"))
				.andExpect(status().isOk())
				.andExpect(content().json(originalNote));
		// Then, change data & see if it actually changed
		mockMvc.perform(patch(BASE_ENDPOINT +"5/").content(postJson).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().json(finalNoteJson));
		// Also, make sure output == GET output
		mockMvc.perform(get(BASE_ENDPOINT +"5/"))
				.andExpect(status().isOk())
				.andExpect(content().json(finalNoteJson));
		// Finally, check list of all notes
		String allJson = getNotesJsonFromDatabase(new Integer[] {1,2,4,6});
		allJson = allJson.substring(0, allJson.length() -1) +","+ finalNoteJson +"]";
		mockMvc.perform(get(BASE_ENDPOINT +""))
				.andExpect(status().isOk())
				.andExpect(content().json(allJson));
	}
	@Test
	public void shouldUpdateMaxLengthNote() throws Exception {
		String postJson = "{\"body\": \"" +"p".repeat(MAX_LENGTH_NOTE) +"\"}";
		String finalNoteJson = addIdToNoteJson(5, postJson);
		mockMvc.perform(patch(BASE_ENDPOINT +"5/").content(postJson).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().json(finalNoteJson));
	}
	@Test
	public void shouldUpdatePartialBadFormat() throws Exception {
		// Expect the null id (an invalid field) to be ignored, while body is updated
		String sharedJson = "\"body\": \"A whole new note!\"}"; // JSON in both POST request & expected output
		String postJson = "{\"id\": null, "+ sharedJson;
		String finalNoteJson = addIdToNoteJson(5, "{"+ sharedJson);
		mockMvc.perform(patch(BASE_ENDPOINT +"5/").content(postJson).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().json(finalNoteJson));
	}

	@Test
	public void failUpdatingMissingNote() throws Exception {
		String postJson = "{\"body\":\"THIS IS SOMETHING ELSE\"}";
		mockMvc.perform(patch(BASE_ENDPOINT +"99/").content(postJson).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isNotFound());
		expectNoChanges(); // Make sure there's no changes to data
	}
	@Test
	public void dontUpdateBadFormat() throws Exception {
		String postJson = "{\"BODY_ZZZ\":\"THIS IS SOMETHING ELSE\"}";
		mockMvc.perform(patch(BASE_ENDPOINT +"5/").content(postJson).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk()); // PATCH should always return OK
		expectNoChanges(); // Make sure there's no changes to data
	}
	@Test
	public void dontUpdateTooLongNote() throws Exception {
		String postJson = "{\"body\": \"" +"a".repeat(MAX_LENGTH_NOTE +1) +"\"}";
		mockMvc.perform(patch(BASE_ENDPOINT +"5/").content(postJson).contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk()); // PATCH should always return OK
		expectNoChanges(); // Make sure there's no changes to data
	}

	// Tests for deleting... ------------------------------------//
	@Test
	public void shouldDeleteANote() throws Exception {
		mockMvc.perform(delete(BASE_ENDPOINT +"2/"))
				.andExpect(status().isNoContent());
		// Check that data is no longer accessable
		mockMvc.perform(get(BASE_ENDPOINT))
				.andExpect(status().isOk())
				.andExpect(content().json(  getNotesJsonFromDatabase(new Integer[] {1,4,5,6})  ));
		mockMvc.perform(get(BASE_ENDPOINT +"2/"))
				.andExpect(status().isNotFound());
	}
	@Test
	public void failDeletingMissingNote() throws Exception {
		mockMvc.perform(delete(BASE_ENDPOINT +"3/"))
				.andExpect(status().isNotFound());
		expectNoChanges(); // Make sure there's no changes to data
	}
}
