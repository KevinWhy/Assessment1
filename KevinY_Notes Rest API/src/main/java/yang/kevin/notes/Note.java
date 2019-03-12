package yang.kevin.notes;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * Note is a model inside the database.
 * @author Kevin Yang
 *
 */
@Entity // Make a table
public class Note {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	@NotNull
	@Size(max=255) // 255 is the max because of database storage type
	private String body;
	
	// Needed to use as database Entity
	public Note() {}
	
	// Fast way to define Notes for testing
	public Note(String body) {
		setBody(body);
	}
	
	// id getter & setter
	public Integer getId() {
		return id;
	}
	public void setId(Integer newId) {
		id = newId;
	}

	// body getter & setter
	public String getBody() {
		return body;
	}
	public void setBody(String newContent) {
		body = newContent;
	}
}
