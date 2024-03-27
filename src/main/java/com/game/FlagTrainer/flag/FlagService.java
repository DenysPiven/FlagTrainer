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
        // 1. Завантажити флаги
        List<Flag> flags = userDataService.loadUserFlags(username);

        if (lastShownFlag != null) {
            flags.remove(lastShownFlag);
        }

        // 2. Розрахунок ваги для кожного прапора
        Map<Flag, Double> flagWeights = new HashMap<>();
        double totalWeight = 0.0;
        for (Flag flag : flags) {
            double T_total = flag.getTimesShown() + 1; // Додавання 1 для уникнення ділення на нуль
            double weight = (1 + flag.getTimesGuessedIncorrectly() / T_total) * (1 - flag.getTimesGuessedCorrectly() / T_total) / 2;
            flagWeights.put(flag, weight);
            totalWeight += weight;
        }

        // 3. Нормалізація ваг для отримання ймовірностей
        for (Flag flag : flags) {
            flagWeights.put(flag, flagWeights.get(flag) / totalWeight);
        }

        // 4. Вибір прапора з урахуванням ймовірності
        double randomValue = Math.random();
        double cumulativeProbability = 0.0;
        for (Map.Entry<Flag, Double> entry : flagWeights.entrySet()) {
            cumulativeProbability += entry.getValue();
            if (randomValue <= cumulativeProbability) {
                lastShownFlag = entry.getKey();
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
            flag.incrementTimesGuessedCorrectly();
        } else {
            flag.incrementTimesGuessedIncorrectly();
        }

        flag.incrementTimesShown();
        userDataService.updateFlagFile(username, flagsMap);
    }
}
