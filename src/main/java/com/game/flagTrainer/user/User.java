package com.game.flagTrainer.user;

import com.game.flagTrainer.flag.Flag;
import lombok.Data;

import java.util.*;

@Data
public class User {
    private String userId;

    private long shownCount = 0;
    private Map<String, Flag> flags = new HashMap<>();

    public User() {}

    public User(String userId) {
        this.userId = userId;
        shownCountCalculate();
    }

    public void shownCountCalculate() {
        shownCount = flags.values().stream()
                .filter(flag -> flag.getShown() > 0)
                .count();
    }

    public void shownCountIncrement(){
        shownCount++;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(userId, user.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId);
    }
}
