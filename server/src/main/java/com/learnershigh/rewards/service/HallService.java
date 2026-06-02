package com.learnershigh.rewards.service;

import com.learnershigh.rewards.dto.ApiDtos.HallWinnerResponse;
import com.learnershigh.rewards.repository.HallWinnerRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HallService {
    private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");
    private final HallWinnerRepository hallWinners;

    public HallService(HallWinnerRepository hallWinners) {
        this.hallWinners = hallWinners;
    }

    @Transactional(readOnly = true)
    public List<HallWinnerResponse> winners() {
        return hallWinners.findTop20ByOrderByWonAtDesc().stream()
                .map(RewardService::toHallWinnerResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public long thisMonthCount() {
        YearMonth month = YearMonth.from(LocalDate.now(ZONE));
        LocalDateTime start = month.atDay(1).atStartOfDay();
        LocalDateTime end = month.atEndOfMonth().atTime(LocalTime.MAX);
        return hallWinners.countByWonAtBetween(start, end);
    }
}
