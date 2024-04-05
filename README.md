# FlagTrainer

FlagTrainer is a web-based application designed to educate users about the flags of various countries through a fun and interactive learning experience.

## Project Structure

- `src/main/java/flagTrainer`: Contains the Java source files for the application.
    - `flag`: Contains classes related to flag handling.
        - `Flag`: Represents a country flag with attributes for display and tracking user answers.
        - `FlagController`: Controls the web requests for displaying flags and receiving user responses.
        - `FlagService`: Handles the logic for selecting flags randomly and tracking user answers.
    - `user`: Contains classes related to user management.
        - `User`: Represents a user entity in the application.
        - `UserController`: Controls the web requests related to user management.
        - `UserService`: Manages the user-related business logic.
    - `FlagTrainerApplication`: The main class that starts the Spring Boot application.
- `src/main/resources`: Contains the resource files like templates and properties.
    - `data`: Directory for data files, such as `flags.json`.
        - `users`: Contains individual user data files (e.g., `User.json`).
        - `flags.json`: Contains the list of countries with their respective flag images, used for the quiz and tracking statistics.
    - `static`: Contains static resources like CSS and JavaScript files.
    - `templates`: Contains HTML template files for the application.
    - `application.properties`: Configuration properties for the application.
- `docker-compose.yml`: Defines the Docker multi-container application setup.
- `Dockerfile`: Contains instructions for building the Docker image of the application.
- `mvnw`, `mvnw.cmd`: Maven wrapper scripts for building the application.
- `pom.xml`: Maven configuration file.
- `README.md`: Provides an overview of the project and setup instructions.

## Running the Application with Docker Compose

To set up and run the application using Docker Compose, execute the following steps:

```bash
# Clone the repository
git clone https://github.com/PivDen2000/FlagTrainer.git
cd FlagTrainer

# Use Docker Compose to build and run the application
docker-compose up --build
```

After running these commands, the FlagTrainer application will be accessible at `http://localhost:8080`.
