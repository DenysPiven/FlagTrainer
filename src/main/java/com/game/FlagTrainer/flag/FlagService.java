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

    public Flag getRandomFlag(String username) {
        // 1. Відсортувати флаги за кількістю показів
        List<Flag> sortedFlags = userDataService.loadUserFlags(username);
        sortedFlags.sort(Comparator.comparingInt(Flag::getTimesShown));

        // 2. Визначити мінімальну кількість показів
        int minShows = sortedFlags.get(0).getTimesShown();

        // 3. Обрати флаги з мінімальною кількістю показів
        List<Flag> leastShownFlags = sortedFlags.stream()
                .filter(flag -> flag.getTimesShown() == minShows)
                .collect(Collectors.toList());

        // 4. Збільшувати шанс вибору флага на основі кількості помилок
        Map<Flag, Double> flagWeights = new HashMap<>();
        for (Flag flag : leastShownFlags) {
            double weight = 1.0 + flag.getTimesGuessedIncorrectly();
            flagWeights.put(flag, weight);
        }

        // 5. Вибрати флаг рандомно, враховуючи вагу
        double totalWeight = flagWeights.values().stream().mapToDouble(Double::doubleValue).sum();
        double randomValue = Math.random() * totalWeight;
        double cumulativeWeight = 0.0;
        for (Map.Entry<Flag, Double> entry : flagWeights.entrySet()) {
            cumulativeWeight += entry.getValue();
            if (randomValue <= cumulativeWeight) {
                return entry.getKey();
            }
        }

        return leastShownFlags.get(new Random().nextInt(leastShownFlags.size())); // На випадок, якщо щось пішло не так
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
