package com.game.flagTrainer.flag;

import com.game.flagTrainer.user.UserDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class FlagService {

    @Autowired
    private UserDataService userDataService;

    private Flag lastShownFlag = null;

    public Flag getRandomFlag(String username) {
        List<Flag> flags = userDataService.loadUserFlags(username);

        if (lastShownFlag != null) {
            flags.remove(lastShownFlag);
        }

        double totalWeight = flags.stream()
                .mapToDouble(Flag::getWeight)
                .sum();

        double randomValue = Math.random() * totalWeight;
        double cumulativeWeight = 0.0;
        for (Flag flag : flags) {
            cumulativeWeight += flag.getWeight();
            if (randomValue <= cumulativeWeight) {
                lastShownFlag = flag;
                return lastShownFlag;
            }
        }

        return flags.get(new Random().nextInt(flags.size())); // Повертаємо випадковий прапор у разі невдачі
    }


    public void setAnswer(String username, String countryName, Boolean isCorrect) {
        List<Flag> userFlags = userDataService.loadUserFlags(username);
        Map<String, Flag> flagsMap = userFlags.stream().collect(Collectors.toMap(Flag::getCountryName, flag -> flag));

        Flag flag = flagsMap.get(countryName);
        if (flag == null) {
            return;
        }

        if (isCorrect) {
            flag.incrementCorrect();
        } else {
            flag.incrementIncorrect();
        }

        flag.incrementShown();
        userDataService.updateFlagFile(username, flagsMap);
    }
}
