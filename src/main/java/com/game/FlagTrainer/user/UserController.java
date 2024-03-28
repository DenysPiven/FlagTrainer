package com.game.FlagTrainer.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.ui.Model;

@Controller
@SessionAttributes("user")
public class UserController {

    @Autowired
    private UserDataService userDataService;

    @GetMapping("/login")
    public String showLoginPage() {
        return "login";
    }

    @PostMapping("/login")
    public String loginUser(@RequestParam String username, Model model) {
        model.addAttribute("user", new User(username));

        return "redirect:/";
    }

    @GetMapping("/logout")
    public String logoutUser(SessionStatus status) {
        status.setComplete();
        return "redirect:/login";
    }
}

