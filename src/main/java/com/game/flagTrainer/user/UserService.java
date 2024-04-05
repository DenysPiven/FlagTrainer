package com.game.flagTrainer.user;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.game.flagTrainer.flag.Flag;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Set;

@Service
public class UserService {
    private final Path templateFilePath = Path.of("data", "flags.json");
    private final Path dataDirectory = Path.of("data", "users");
    private final ObjectMapper objectMapper = new ObjectMapper();

    public User getByUserId(String userId){
        User user = new User(userId);
        Set<Flag> flags = readUserFlags(userId);
        user.setFlags(flags);
        return user;
    }

    public void createUserFlags(String userId) {
        try {
            Path userFilePath = dataDirectory.resolve(userId + ".json");
            Files.createDirectories(dataDirectory);
            Set<Flag> flags = objectMapper.readValue(templateFilePath.toFile(), new TypeReference<>() {});
            flags.forEach(flag -> flag.setUserId(userId));

            objectMapper.writeValue(userFilePath.toFile(), flags);
        } catch (IOException e) {
            System.err.println("Error creating flags file for user " + userId);
        }
    }

    public Set<Flag> readUserFlags(String userId) {
        try {
            Path userFilePath = dataDirectory.resolve(userId + ".json");
            if (!Files.exists(userFilePath)) {
                createUserFlags(userId);
            }
            return objectMapper.readValue(Files.newInputStream(userFilePath), new TypeReference<>() {});
        } catch (IOException e) {
            System.err.println("Error loading flags for user " + userId);
        }
        return null;
    }

    public void updateUserFlags(String userId, Set<Flag> flags) {
        try {
            Path userFilePath = dataDirectory.resolve(userId + ".json");
            objectMapper.writeValue(Files.newOutputStream(userFilePath), flags);
        } catch (IOException e) {
            System.err.println("Error updating flags file for user " + userId);
        }
    }

    public void deleteUserFlags(String userId) {
        try {
            Path userFilePath = dataDirectory.resolve(userId + ".json");
            Files.deleteIfExists(userFilePath);
        } catch (IOException e) {
            System.err.println("Error deleting flags file for user " + userId);
        }
    }
}