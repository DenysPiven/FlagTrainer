package com.game.flagTrainer.user;

import com.game.flagTrainer.flag.Flag;
import lombok.Data;

import java.util.*;

@Data
public class User {
    private String userId;
    private Map<String, Flag> flags = new HashMap<>();

    public User() {}

    public User(String userId) {
        this.userId = userId;
    }

    public void addOrUpdateFlag(Flag flag) {
        flags.put(flag.getFlagId(), flag);
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
