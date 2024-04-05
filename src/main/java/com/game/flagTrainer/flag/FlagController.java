package com.game.flagTrainer.flag;

import com.game.flagTrainer.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping("/")
    public String redirectToLogin() {
        return "redirect:/login";
    }

    @PostMapping("/")
    public String showFlag(@RequestParam("userId") String userId, Model model) {
        if(userId == null || userId.trim().isEmpty() || !userId.matches("[A-Za-z]+")) {
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
                "imageUrl", flag.getImageUrl()
        );
        return ResponseEntity.ok(flagData);
    }
}
