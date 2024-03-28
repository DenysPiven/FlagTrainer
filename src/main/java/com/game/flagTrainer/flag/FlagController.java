package com.game.flagTrainer.flag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
public class FlagController {

    private final FlagService flagService;

    @Autowired
    public FlagController(FlagService flagService) {
        this.flagService = flagService;
    }

    @GetMapping("/")
    public String redirectToLogin() {
        return "redirect:/login";
    }

    @GetMapping("/{username}")
    public String showFlag(@PathVariable("username") String username, Model model) {

        if(model.getAttribute("user") == null) {
            model.addAttribute("user", username);
        }

        Flag flag = flagService.getRandomFlag(username);
        model.addAttribute("flag", flag);

        return "index";
    }

    @PostMapping("/{username}/set")
    public ResponseEntity<?> setFlagAnswer(@PathVariable String username, @RequestParam String countryName, @RequestParam Boolean isCorrect) {
        flagService.setAnswer(username, countryName, isCorrect);
        return ResponseEntity.ok(Map.of("isCorrect", isCorrect));
    }

    @GetMapping("/{username}/flag")
    public ResponseEntity<?> getRandomFlag(@PathVariable String username) {

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
