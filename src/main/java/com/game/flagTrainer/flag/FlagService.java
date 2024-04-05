package com.game.flagTrainer.flag;

import com.game.flagTrainer.user.User;
import com.game.flagTrainer.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class FlagService {
    private final UserService userService;
    private Flag lastShownFlag = null;

    @Autowired
    public FlagService(UserService userService) {
        this.userService = userService;
    }

    public Flag getRandomFlag(String userId) {
        User user = userService.getByUserId(userId);
        Set<Flag> flags = user.getFlags();

        if (lastShownFlag != null) {
            flags.removeIf(f -> f.getFlagId().equals(lastShownFlag.getFlagId()));
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

        userService.updateUserFlags(userId, user.getFlags());
    }
}

