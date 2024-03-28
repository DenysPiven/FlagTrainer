package com.game.FlagTrainer.flag;

import com.game.FlagTrainer.user.UserDataService;
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

        double totalWeight = 0.0;
        Map<Flag, Double> flagWeights = new HashMap<>();
        for (Flag flag : flags) {
            double T_total = flag.getTimesShown() + 1;
            double weight = (1 + (double)flag.getTimesGuessedIncorrectly() / T_total) /
                    (1 + (double)flag.getTimesGuessedCorrectly() / T_total);
            weight *= (1.0 / T_total); // Збільшення ваги для прапорів, що показувались менше
            flagWeights.put(flag, weight);
            totalWeight += weight;
        }

        // Нормалізація ваги
        for (Flag flag : flagWeights.keySet()) {
            flagWeights.put(flag, flagWeights.get(flag) / totalWeight);
        }

        // Вибір прапора з урахуванням ймовірності
        double randomValue = Math.random();
        double cumulativeWeight = 0.0;
        for (Map.Entry<Flag, Double> entry : flagWeights.entrySet()) {
            cumulativeWeight += entry.getValue();
            if (randomValue <= cumulativeWeight) {
                lastShownFlag = entry.getKey();
                return lastShownFlag;
            }
        }

        return flags.get(new Random().nextInt(flags.size()));
    }


    public void setAnswer(String username, String countryName, Boolean isCorrect) {
        List<Flag> userFlags = userDataService.loadUserFlags(username);
        Map<String, Flag> flagsMap = userFlags.stream().collect(Collectors.toMap(Flag::getCountryName, flag -> flag));

        Flag flag = flagsMap.get(countryName);
        if (flag == null) {
            return;
        }

        if (isCorrect) {
            flag.incrementTimesGuessedCorrectly();
        } else {
            flag.incrementTimesGuessedIncorrectly();
        }

        flag.incrementTimesShown();
        userDataService.updateFlagFile(username, flagsMap);
    }
}
