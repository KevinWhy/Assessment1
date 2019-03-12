package yang.kevin.notes;

import org.springframework.data.repository.CrudRepository;

// Handle database cmds for the CRUD operations
/**
 * This interface specifies CRUD operations for the Note model. (It abstracts away the SQL...)
 * However, it doesn't define REST API endpoints.
 * @author oKevi
 *
 */
public interface NoteRepository extends CrudRepository<Note, Integer> {
	// Spring converts the function name into a query
	// Note: Case-insensitive search was chosen because it's easier to demonstrate that query can find multiple objects
	/**
	 * Search for notes with the specified content.
	 * Content can be anywhere inside the body of the Note.
	 * 
	 * @param content String to search for (Case-insensitive)
	 * @return All of the notes with the specified content
	 */
	Iterable<Note> findNotesByBodyIgnoreCaseContaining(String content);
}
