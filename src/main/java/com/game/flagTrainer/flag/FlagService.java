package com.game.flagTrainer.flag;

import com.game.flagTrainer.user.User;
import com.game.flagTrainer.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
public class FlagService {
    private final UserService userService;

    @Autowired
    public FlagService(UserService userService) {
        this.userService = userService;
    }

    public Flag getRandomFlag(String userId) {
        User user = userService.getByUserId(userId);
        Map<String, Flag> flags = new HashMap<>(user.getFlags());

        if (user.getShownCount() < flags.size()) {
            flags.values().removeIf(flag -> flag.getShown() > 0);
            user.shownCountIncrement();
        }

        double totalWeight = flags.values().stream()
                .mapToDouble(Flag::getWeight)
                .sum();
        double randomValue = Math.random() * totalWeight;
        double cumulativeWeight = 0.0;

        for (Flag flag : flags.values()) {
            cumulativeWeight += flag.getWeight();
            if (randomValue <= cumulativeWeight) {
                return flag;
            }
        }

        return null;
    }


    public void setAnswer(String userId, String flagId, Boolean isCorrect) {
        User user = userService.getByUserId(userId);
        Flag flag = user.getFlags().get(flagId);

        if (isCorrect) {
            flag.incrementCorrect();
        } else {
            flag.incrementIncorrect();
        }
        flag.incrementShown();

        Set<Flag> flagSet = new HashSet<>(user.getFlags().values());
        userService.updateUserFlags(userId, flagSet);
    }
}

