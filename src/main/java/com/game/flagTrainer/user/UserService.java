package com.game.flagTrainer.user;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.game.flagTrainer.flag.Flag;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
public class UserService {
    private final Path templateFilePath = Path.of("data", "flags.json");
    private final Path dataDirectory = Path.of("data", "users");
    private final ObjectMapper objectMapper = new ObjectMapper();
    private User currentUser = null;

    public User getByUserId(String userId){
        if (currentUser != null && userId.equals(currentUser.getUserId())) {
            return currentUser;
        }

        Set<Flag> flagSet = readUserFlags(userId);
        Map<String, Flag> flagMap = new HashMap<>();
        for (Flag flag : flagSet) {
            flagMap.put(flag.getFlagId(), flag);
        }

        User user = new User(userId);
        user.setFlags(flagMap);
        currentUser = user;
        return user;
    }

    public void createUserFlags(String userId) {
        try {
            Path userFilePath = dataDirectory.resolve(userId + ".json");
            Files.createDirectories(dataDirectory);
            Set<Flag> flags = objectMapper.readValue(templateFilePath.toFile(), new TypeReference<>() {});

            objectMapper.writeValue(userFilePath.toFile(), flags);
        } catch (IOException e) {
            deleteUserFlags(userId);
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
            deleteUserFlags(userId);
            System.err.println("Error loading flags for user " + userId);
        }
        return null;
    }

    public void updateUserFlags(String userId, Set<Flag> flags) {
        try {
            Path userFilePath = dataDirectory.resolve(userId + ".json");
            objectMapper.writeValue(Files.newOutputStream(userFilePath), flags);
        } catch (IOException e) {
            deleteUserFlags(userId);
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