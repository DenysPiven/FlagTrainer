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

        // Видаляємо останній показаний прапор, щоб він не показувався двічі підряд
        if (lastShownFlag != null) {
            flags.remove(lastShownFlag);
        }

        // 2. Розрахунок ваги для кожного прапора
        Map<Flag, Double> flagWeights = new HashMap<>();
        for (Flag flag : flags) {
            double T_total = flag.getTimesShown() + 1; // Додавання 1 для уникнення ділення на нуль
            double weight = (1.0 / T_total) +
                    ((double) flag.getTimesGuessedIncorrectly() / T_total) -
                    ((double) flag.getTimesGuessedCorrectly() / T_total);
            flagWeights.put(flag, weight);
        }

        // 3. Нормалізація ваг для отримання ймовірностей
        double totalWeight = flagWeights.values().stream().mapToDouble(Double::doubleValue).sum();
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

        // В якості запасного варіанту повертаємо випадковий прапор
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
