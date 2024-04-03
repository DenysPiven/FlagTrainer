package com.game.flagTrainer.flag;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.game.flagTrainer.user.User;
import com.game.flagTrainer.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.beans.FixedKeySet;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FlagService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final UserService userService;
    private Flag lastShownFlag = null;

    @Autowired
    public FlagService(UserService userService) {
        this.userService = userService;
    }

    private Set<Flag> getBaseFlags() {
        Set<Flag> baseFlags = new HashSet<>();
        try {
            Resource resource = new ClassPathResource("data/flags.json");
            InputStream inputStream = resource.getInputStream();
            List<Flag> flags = objectMapper.readValue(inputStream, new TypeReference<>() {
            });
            baseFlags.addAll(flags);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return baseFlags;
    }

    public void initializeUserFlags(String userId) {
        Set<Flag> flags = getBaseFlags();
        flags.forEach(flag -> flag.setUserId(userId));
        userService.setFlags(userId, flags);
    }

    public Flag getRandomFlag(String userId) {
        User user = userService.getByUserId(userId);

        if(user.getFlags().isEmpty()){
            initializeUserFlags(userId);
        }

        Set<Flag> flags = user.getFlags();

        if (lastShownFlag != null) {
            flags.removeIf(uf -> uf.getFlagId().equals(lastShownFlag.getFlagId()));
        }

        double totalWeight = flags.stream()
                .mapToDouble(Flag::getWeight)
                .sum();

        double randomValue = Math.random() * totalWeight;
        double cumulativeWeight = 0.0;
        Flag chosenFlag = null;
        for (Flag flag : flags) {
            cumulativeWeight += flag.getWeight();
            if (randomValue <= cumulativeWeight) {
                chosenFlag = flag;
                break;
            }
        }

        return chosenFlag;
    }

    public void setAnswer(String userId, String flagId, Boolean isCorrect) {

        User user = userService.getByUserId(userId);
        Flag flag = user.getFlags().stream()
                .filter(f -> f.getFlagId().equals(flagId))
                .findFirst()
                .orElse(null);

        if (isCorrect) {
            flag.incrementCorrect();
        } else {
            flag.incrementIncorrect();
        }

        flag.incrementShown();
    }
}

