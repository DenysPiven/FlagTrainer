package com.game.flagTrainer.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class UserController {

    public final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/login")
    public String showLoginPage() {
        return "login";
    }

    @PostMapping("/login")
    public String loginUser(@RequestParam String userId) {
        return "redirect:/" + userId;
    }

    @GetMapping("/logout")
    public String logoutUser() {
        saveUserFlags();
        return "redirect:/login";
    }

    @PostMapping("/save")
    public void saveUserFlags() {
        userService.saveUser();
    }
}
