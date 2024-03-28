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
    private Double weight = null;

    public void incrementTimesShown() {
        this.timesShown++;
        this.weight = null;
    }

    public void incrementTimesGuessedCorrectly() {
        this.timesGuessedCorrectly++;
        this.weight = null;
    }

    public void incrementTimesGuessedIncorrectly() {
        this.timesGuessedIncorrectly++;
        this.weight = null;
    }

    public double getWeight() {
        if (weight == null) {
            weight = calculateWeight();
        }
        return weight;
    }

    private double calculateWeight() {
        double x = timesGuessedIncorrectly;
        double y = timesGuessedCorrectly;

        return 0.5 * (1 / (1 + x + y) + 1 / (1 + x) + 1 - 1 / (1 + y));
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
