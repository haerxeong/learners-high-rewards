package com.learnershigh.rewards.controller;

import com.learnershigh.rewards.dto.ApiDtos.*;
import com.learnershigh.rewards.entity.UserAccount;
import com.learnershigh.rewards.service.RewardService;
import com.learnershigh.rewards.service.UserService;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rewards")
public class RewardController {
    private final UserService users;
    private final RewardService rewards;

    public RewardController(UserService users, RewardService rewards) {
        this.users = users;
        this.rewards = rewards;
    }

    @PostMapping("/daily/claim")
    public DailyClaimResponse claimDaily(
            @RequestHeader(value = "X-Demo-User", required = false) String externalId,
            @RequestBody(required = false) DailyClaimRequest request
    ) {
        UserAccount user = users.getOrCreate(externalId);
        return rewards.claimDaily(user);
    }

    @PostMapping("/big/spin")
    public BigSpinResponse spinBig(@RequestHeader(value = "X-Demo-User", required = false) String externalId) {
        UserAccount user = users.getOrCreate(externalId);
        return rewards.spinBig(user);
    }

    @GetMapping("/logs")
    public List<RewardLogResponse> logs(@RequestHeader(value = "X-Demo-User", required = false) String externalId) {
        UserAccount user = users.getOrCreate(externalId);
        return rewards.logs(user);
    }
}
