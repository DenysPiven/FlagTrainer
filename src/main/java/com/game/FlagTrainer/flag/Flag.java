package com.game.FlagTrainer.flag;

import lombok.Data;

import java.util.Objects;

@Data
public class Flag {
    private String countryName;
    private String imageUrl;
    private int timesShown;
    private int timesGuessedCorrectly;
    private int timesGuessedIncorrectly;
    private Double probability = null; // Ймовірність, яка кешується

    public void incrementTimesShown() {
        this.timesShown++;
        this.probability = null; // Скидання кешованої ймовірності
    }

    public void incrementTimesGuessedCorrectly() {
        this.timesGuessedCorrectly++;
        this.probability = null; // Скидання кешованої ймовірності
    }

    public void incrementTimesGuessedIncorrectly() {
        this.timesGuessedIncorrectly++;
        this.probability = null; // Скидання кешованої ймовірності
    }

    public double getProbability() {
        if (probability == null) {
            probability = calculateProbability();
        }
        return probability;
    }

    private double calculateProbability() {
        return (1 + (double) timesGuessedIncorrectly / (1 + timesShown)) /
                (1 + (double) timesGuessedCorrectly / (1 + timesShown)) / (1 + timesShown);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Flag flag = (Flag) o;

        return Objects.equals(countryName, flag.countryName);
    }

    @Override
    public int hashCode() {
        return countryName != null ? countryName.hashCode() : 0;
    }
}
