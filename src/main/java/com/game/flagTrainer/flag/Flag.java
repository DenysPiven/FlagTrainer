package com.game.flagTrainer.flag;

import lombok.Data;

import java.util.Objects;

@Data
public class Flag {
    private String countryName;
    private String imageUrl;
    private int shown;
    private int correct;
    private int incorrect;
    private Double weight = null;

    public void incrementShown() {
        this.shown++;
        this.weight = null;
    }

    public void incrementCorrect() {
        this.correct++;
        this.weight = null;
    }

    public void incrementIncorrect() {
        this.incorrect++;
        this.weight = null;
    }

    public double getWeight() {
        if (weight == null) {
            weight = calculateWeight();
        }
        return weight;
    }

    private double calculateWeight() {
        if(shown < 1){
            return 1000;
        }
        return 1 / (1 + Math.exp(correct - incorrect));
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
