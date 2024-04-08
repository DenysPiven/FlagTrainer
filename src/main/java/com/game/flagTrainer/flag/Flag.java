package com.game.flagTrainer.flag;

import lombok.Data;

import java.util.Objects;

@Data
public class Flag {
    private String flagId;
    private String imageUrl;
    private String capital;
    private String continent;

    private int shown;
    private int correct;
    private int incorrect;
    private double weight;

    public Flag() {
        weight = 1000.0;
    }

    public void incrementShown() {
        this.shown++;
        calculateWeight();
    }

    public void incrementCorrect() {
        this.correct++;
    }

    public void incrementIncorrect() {
        this.incorrect++;
    }

    private void calculateWeight() {
        weight = 1.0 / (1 + Math.exp(correct - incorrect));
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Flag flag = (Flag) o;
        return Objects.equals(flagId, flag.flagId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(flagId);
    }
}
