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

    public void incrementTimesShown() {
        this.timesShown++;
    }

    public void incrementTimesGuessedCorrectly() {
        this.timesGuessedCorrectly++;
    }

    public void incrementTimesGuessedIncorrectly() {
        this.timesGuessedIncorrectly++;
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
