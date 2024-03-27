package com.game.FlagTrainer.flag;

import com.game.FlagTrainer.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;

import java.util.Map;

@Controller
public class FlagController {

    private final FlagService flagService;

    @Autowired
    public FlagController(FlagService flagService) {
        this.flagService = flagService;
    }

    @GetMapping("/")
    public String showFlag(@SessionAttribute(name = "user", required = false) User user, Model model) {
        if (user == null) {
            return "redirect:/login";
        }

        Flag flag = flagService.getRandomFlag(user.getUsername());
        model.addAttribute("flag", flag);
        model.addAttribute("user", user);

        return "index";
    }

    @PostMapping("/set")
    public ResponseEntity<?> setFlagAnswer(@RequestParam String username, @RequestParam String countryName, @RequestParam Boolean isCorrect) {
        flagService.setAnswer(username, countryName, isCorrect);
        return ResponseEntity.ok(Map.of("isCorrect", isCorrect));
    }

    @GetMapping("/flag")
    public ResponseEntity<?> getRandomFlag(@SessionAttribute("user") User user) {
        String username = user.getUsername();
        Flag flag = flagService.getRandomFlag(username);
        Map<String, Object> flagData = Map.of(
                "countryName", flag.getCountryName(),
                "imageUrl", flag.getImageUrl(),
                "timesShown", flag.getTimesShown(),
                "timesGuessedCorrectly", flag.getTimesGuessedCorrectly(),
                "timesGuessedIncorrectly", flag.getTimesGuessedIncorrectly()
        );
        return ResponseEntity.ok(flagData);
    }

}
