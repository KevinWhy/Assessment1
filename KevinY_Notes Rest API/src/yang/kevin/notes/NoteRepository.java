package yang.kevin.notes;

import org.springframework.data.repository.CrudRepository;

// Handle SQL for the CRUD operations
/**
 * This interface specifies CRUD operations for the Note model. (It abstracts away the SQL...)
 * However, it doesn't define REST API endpoints.
 * @author oKevi
 *
 */
public interface NoteRepository extends CrudRepository<Note, Integer> {
	// Spring converts the function name into a query
	/**
	 * Search for notes with the specified content.
	 * Content can be anywhere inside the body of the Note.
	 * 
	 * @param content String to search for (Case-insensitive)
	 * @return All of the notes with the specified content
	 */
	Iterable<Note> findNotesByBodyContaining(String content);
}
