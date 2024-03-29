package com.game.flagTrainer.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.ui.Model;

@Controller
public class UserController {

    @Autowired
    private UserDataService userDataService;

    @GetMapping("/login")
    public String showLoginPage() {
        return "login";
    }

    @PostMapping("/login")
    public String loginUser(@RequestParam String username) {
        return "redirect:/" + username;
    }

    @GetMapping("/logout")
    public String logoutUser() {
        return "redirect:/login";
    }
}

