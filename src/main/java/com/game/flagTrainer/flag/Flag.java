package com.game.flagTrainer.flag;

import lombok.Data;
import org.springframework.data.mongodb.core.index.CompoundIndex;

import java.util.Objects;

@Data
@CompoundIndex(def = "{'userId': 1, 'flagId': 1}", unique = true)
public class Flag {
    private String userId;
    private String flagId;

    private String imageUrl;

    private int shown;
    private int correct;
    private int incorrect;
    private Double weight;

    public Flag() {
        this.weight = null;
    }

    public void incrementShown() {
        this.shown++;
        invalidateWeight();
    }

    public void incrementCorrect() {
        this.correct++;
        invalidateWeight();
    }

    public void incrementIncorrect() {
        this.incorrect++;
        invalidateWeight();
    }

    private void invalidateWeight() {
        this.weight = null;
    }

    public double getWeight() {
        if (weight == null) {
            weight = calculateWeight();
        }
        return weight;
    }

    private double calculateWeight() {
        if (shown == 0) {
            return 1000.0;
        }
        return 1.0 / (1 + Math.exp(correct - incorrect));
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Flag flag = (Flag) o;
        return Objects.equals(userId, flag.userId) &&
                Objects.equals(flagId, flag.flagId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, flagId);
    }
}
