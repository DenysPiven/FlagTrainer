package com.game.FlagTrainer.user;

import lombok.Data;

@Data
public class User {
    private String username;

    User(String username){
        this.username = username;
    }
}

