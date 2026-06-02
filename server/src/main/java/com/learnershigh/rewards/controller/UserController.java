package com.learnershigh.rewards.controller;

import com.learnershigh.rewards.dto.ApiDtos.UserStateResponse;
import com.learnershigh.rewards.entity.UserAccount;
import com.learnershigh.rewards.service.UserService;
import java.time.LocalDate;
import java.time.ZoneId;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/me")
public class UserController {
    private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");
    private final UserService users;

    public UserController(UserService users) {
        this.users = users;
    }

    @GetMapping("/state")
    public UserStateResponse state(@RequestHeader(value = "X-Demo-User", required = false) String externalId) {
        UserAccount user = users.getOrCreate(externalId);
        return users.toState(user, LocalDate.now(ZONE));
    }
}
