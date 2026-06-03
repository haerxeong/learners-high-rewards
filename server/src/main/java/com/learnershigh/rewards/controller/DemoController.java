package com.learnershigh.rewards.controller;

import com.learnershigh.rewards.dto.ApiDtos.UserStateResponse;
import com.learnershigh.rewards.service.DemoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/demo")
public class DemoController {
    private final DemoService demo;

    public DemoController(DemoService demo) {
        this.demo = demo;
    }

    @PostMapping("/reset")
    public UserStateResponse reset(@RequestHeader(value = "X-Demo-User", required = false) String externalId) {
        return demo.reset(externalId);
    }
}
