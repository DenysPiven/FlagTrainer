package com.game.flags.flag;

import lombok.Data;

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
}
