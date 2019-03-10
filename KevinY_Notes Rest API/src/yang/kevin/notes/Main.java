package yang.kevin.notes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// TODO: @ Run instructions, need to setup DB & user login also
// TODO: @ user create, limit permissions! (Try: select, insert, delete, update from: https://spring.io/guides/gs/accessing-data-mysql/)
// TODO: Note heavily referenced https://www.springboottutorial.com/spring-boot-crud-rest-service-with-jpa-hibernate
// TODO: Note heavily referenced https://spring.io/guides/
// TODO: Change port to localhost:80

/**
 * Main class is used to configure & run the Spring application.
 * @author Kevin Yang
 *
 */
@SpringBootApplication
public class Main {
	public static void main(String[] args) {
		SpringApplication.run(Main.class, args);
	}

}
