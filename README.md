# FlagTrainer

FlagTrainer is a web-based application designed to help users learn and recognize flags of different countries.

## Data Files

- `flags.json`: Contains the list of countries with their respective flag image URLs and statistics for display and answer tracking.

## Key Components

- `Flag`: Represents a country flag with metadata for tracking display and answer statistics.
- `FlagController`: Manages web requests related to flag display and user responses.
- `FlagService`: Contains the logic to randomly select flags and record user responses.
- `User`: Represents a user of the application.
- `UserDataService`: Manages the reading and writing of user-specific data files.
- `LoginController`: Manages the login and logout process.
- `FlagTrainerApplication`: The entry point of the Spring Boot application.

## Cloning and Running the Application

To clone the repository and run the application using Docker, follow these steps:

```bash
# Clone the repository
git clone https://github.com/PivDen2000/FlagTrainer.git
cd FlagTrainer

# Build the Docker image
docker build -t flagtrainer-app .

# Run the application
docker run -p 8080:8080 flagtrainer-app
```

The application will be accessible on `http://localhost:8080`.