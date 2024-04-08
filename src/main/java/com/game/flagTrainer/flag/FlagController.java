package com.game.flagTrainer.flag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@Controller
public class FlagController {
    private final FlagService flagService;

    @Autowired
    public FlagController(FlagService flagService) {
        this.flagService = flagService;
    }

    private boolean isValidUser(String userId) {
        return userId != null && !userId.trim().isEmpty() && userId.matches("[A-Za-z]+");
    }

    @GetMapping("/")
    public String redirectToLogin() {
        return "redirect:/login";
    }

    @PostMapping("/")
    public String showFlag(@RequestParam("userId") String userId, Model model) {
        if(!isValidUser(userId)) {
            return redirectToLogin();
        }

        if(model.getAttribute("userId") == null) {
            model.addAttribute("userId", userId);
        }

        Flag flag = flagService.getRandomFlag(userId);
        model.addAttribute("flag", flag);

        return "index";
    }

    @PostMapping("/set")
    public ResponseEntity<?> setFlagAnswer(@RequestParam String userId, @RequestParam String flagId, @RequestParam Boolean isCorrect) {
        flagService.setAnswer(userId, flagId, isCorrect);
        return ResponseEntity.ok(Map.of("isCorrect", isCorrect));
    }

    @PostMapping("/flag")
    public ResponseEntity<?> getRandomFlag(@RequestParam String userId) {

        Flag flag = flagService.getRandomFlag(userId);
        Map<String, Object> flagData = Map.of(
                "flagId", flag.getFlagId(),
                "imageUrl", flag.getImageUrl(),
                "capital", flag.getCapital(),
                "continent", flag.getContinent()
        );
        return ResponseEntity.ok(flagData);
    }
}
