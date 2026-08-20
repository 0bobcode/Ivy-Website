package ai.ivyschool.catalog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class CourseCatalogServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CourseCatalogServiceApplication.class, args);
	}

}
