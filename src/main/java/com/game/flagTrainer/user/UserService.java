package com.game.flagTrainer.user;

import com.game.flagTrainer.flag.Flag;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepository;

    private User currentUser = null;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Scheduled(fixedRate = 10000)
    public void saveUser(){
        userRepository.save(currentUser);
    }

    public User getByUserId(String userId) {
        if(currentUser == null || !currentUser.getUserId().equals(userId)){
            currentUser = userRepository.findByUserId(userId)
                    .orElse(createUser(userId));
        }
        return currentUser;
    }

    public void setFlags(String userId, Set<Flag> flags) {
        if (flags == null || flags.contains(null)) {
            throw new IllegalArgumentException("The set of userFlags cannot be null or contain null elements.");
        }

        User user = getByUserId(userId);
        user.setFlags(flags);
    }

    public User createUser(String userId) {
        return new User(userId);
    }
}