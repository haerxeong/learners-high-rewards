package com.learnershigh.rewards.controller;

import com.learnershigh.rewards.dto.ApiDtos.HallWinnerResponse;
import com.learnershigh.rewards.service.HallService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hall")
public class HallController {
    private final HallService hall;

    public HallController(HallService hall) {
        this.hall = hall;
    }

    @GetMapping("/winners")
    public List<HallWinnerResponse> winners() {
        return hall.winners();
    }

    @GetMapping("/stats")
    public Map<String, Long> stats() {
        return Map.of("this_month_count", hall.thisMonthCount());
    }
}
