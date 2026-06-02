package com.learnershigh.rewards.controller;

import com.learnershigh.rewards.dto.ApiDtos.ShieldUseResponse;
import com.learnershigh.rewards.entity.UserAccount;
import com.learnershigh.rewards.service.ShieldService;
import com.learnershigh.rewards.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shields")
public class ShieldController {
    private final UserService users;
    private final ShieldService shields;

    public ShieldController(UserService users, ShieldService shields) {
        this.users = users;
        this.shields = shields;
    }

    @PostMapping("/use")
    public ShieldUseResponse use(@RequestHeader(value = "X-Demo-User", required = false) String externalId) {
        UserAccount user = users.getOrCreate(externalId);
        return shields.useToday(user);
    }
}
