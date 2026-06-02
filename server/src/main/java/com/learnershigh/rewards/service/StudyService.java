package com.learnershigh.rewards.service;

import com.learnershigh.rewards.dto.ApiDtos.StudySummaryResponse;
import com.learnershigh.rewards.entity.UserAccount;
import java.util.ArrayList;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class StudyService {
    private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");

    public StudySummaryResponse summary(UserAccount user) {
        LocalDate today = LocalDate.now(ZONE);
        List<Integer> shieldedDays = new ArrayList<>(List.of(6));
        if (today.equals(user.getLastShieldUsedDate()) && !shieldedDays.contains(today.getDayOfMonth())) {
            shieldedDays.add(today.getDayOfMonth());
        }
        return new StudySummaryResponse(
                today,
                today.getYear() + "년 " + today.getMonthValue() + "월",
                45,
                120,
                87,
                today.equals(user.getLastDailyClaimDate()) ? 0 : 1,
                List.of(1, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29),
                shieldedDays
        );
    }
}
