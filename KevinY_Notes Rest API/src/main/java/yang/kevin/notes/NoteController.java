package yang.kevin.notes;

import java.net.URI;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

/**
 * This class handles the notes collection endpoints.
 * @author Kevin Yang
 *
 */
@RestController
@RequestMapping(path="/api/notes")
public class NoteController {
	@Autowired
	private NoteRepository noteRepository; // Injected via Spring
	@Autowired
	private Validator validator; // To allow extension of PATCH later on

	/**
	 * Get all notes. Can be filtered via a query parameter.
	 * @param content If specified, only returns notes containing this string.
	 * @return HTTP response of all the notes found
	 */
	@GetMapping(value="/")
	public ResponseEntity<?> getAllNotes(@RequestParam(name="query", required=false) String content) {
		// Try applying filter
		if (content != null)
			return ResponseEntity.ok(noteRepository.findNotesByBodyIgnoreCaseContaining(content));
		// Otherwise, just return all notes
		return ResponseEntity.ok(noteRepository.findAll());
	}
	
	// Add new note
	/**
	 * Create a new note & save it.
	 * @param newNoteParams The note to save.
	 * @return HTTP response that says if note was successfully created or not.
	 */
	@PostMapping(value="/")
	public ResponseEntity<?> createNote(@RequestBody @Valid Note newNoteParams) {
		Note newNote = noteRepository.save(newNoteParams);
		URI result = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(newNote).toUri();
		return ResponseEntity.created(result).build();
	}
	
	// Methods for specific notes  ------------------------------------//
	/**
	 * Find one note by it's id.
	 * @param id Id to search for
	 * @return HTTP response describing the note, if found.
	 */
	@GetMapping(value="/{id}")
	public ResponseEntity<?> getNote(@PathVariable Integer id) {
		Optional<Note> result = noteRepository.findById(id);
		if (result.isEmpty())
			return ResponseEntity.notFound().build();
		return ResponseEntity.ok(result.get());
	}
	
	/**
	 * Replace the note with specified id by the newNoteParams.
	 * @param id Note to replace. If not found, nothing happens.
	 * @param newNoteParams Everything that should be saved in the new note
	 * @return HTTP response indicating if replacement was a success.
	 */
	@PutMapping(value="/{id}")
	public ResponseEntity<?> putNote(@PathVariable Integer id, @RequestBody @Valid Note newNoteParams) {
		Optional<Note> noteFound = noteRepository.findById(id);
		if (noteFound.isEmpty())
			return ResponseEntity.notFound().build();
		// Just overwrite all properties with the ones from the request
		newNoteParams.setId(noteFound.get().getId());
		return ResponseEntity.ok(noteRepository.save(newNoteParams));
	}
	/**
	 * Update specified fields of the note with the given id.
	 * @param id Node to update
	 * @param newNoteParams Partially filled note. Specified fields will be replaced with these values
	 * @return HTTP response describing the updated note, if found.
	 */
	@PatchMapping(value="/{id}")
	public ResponseEntity<?> patchNote(@PathVariable Integer id, @RequestBody Note newNoteParams) {
		Optional<Note> noteFound = noteRepository.findById(id);
		if (noteFound.isEmpty())
			return ResponseEntity.notFound().build();
		Note note = noteFound.get();
		// See which fields have errors...
		BindingResult errors = new BeanPropertyBindingResult(note, "note");
		validator.validate(newNoteParams, errors);
		// If body is specified & valid, update it
		if (errors.getRawFieldValue("body") != null && !errors.hasFieldErrors("body"))
			note.setBody(newNoteParams.getBody());
		// Notice: In the future, could repeat the if statement & setter without much hassle
		// Save updated note
		return ResponseEntity.ok(noteRepository.save(note));
	}
	
	/**
	 * Delete a note by its id.
	 * @param id Note to delete
	 * @return HTTP response describing if deletion was successful.
	 */
	@DeleteMapping(value="/{id}")
	public ResponseEntity<?> deleteNote(@PathVariable Integer id) {
		Optional<Note> noteFound = noteRepository.findById(id);
		if (noteFound.isEmpty())
			return ResponseEntity.notFound().build();
		// Delete the node found
		noteRepository.delete(noteFound.get());
		return ResponseEntity.noContent().build();
	}
}
