package com.learnershigh.rewards.controller;

import com.learnershigh.rewards.dto.ApiDtos.StudySummaryResponse;
import com.learnershigh.rewards.entity.UserAccount;
import com.learnershigh.rewards.service.StudyService;
import com.learnershigh.rewards.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/study")
public class StudyController {
    private final UserService users;
    private final StudyService study;

    public StudyController(UserService users, StudyService study) {
        this.users = users;
        this.study = study;
    }

    @GetMapping("/summary")
    public StudySummaryResponse summary(@RequestHeader(value = "X-Demo-User", required = false) String externalId) {
        UserAccount user = users.getOrCreate(externalId);
        return study.summary(user);
    }
}
