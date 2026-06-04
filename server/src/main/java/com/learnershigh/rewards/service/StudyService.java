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
        List<Integer> achievedDays = achievedDaysForCurrentMonth(user, today);
        List<Integer> shieldedDays = shieldedDaysForCurrentMonth(user, today);
        int protectedDays = achievedDays.size() + shieldedDays.size();
        int todayStudyMinutes = today.equals(user.getLastDailyClaimDate()) ? 120 : 45;
        int monthlyAchievementRate = today.getDayOfMonth() == 0
                ? 0
                : Math.round((protectedDays * 100.0f) / today.getDayOfMonth());

        return new StudySummaryResponse(
                today,
                today.getYear() + "년 " + today.getMonthValue() + "월",
                todayStudyMinutes,
                120,
                monthlyAchievementRate,
                today.equals(user.getLastDailyClaimDate()) ? 0 : 1,
                achievedDays,
                shieldedDays
        );
    }

    private List<Integer> achievedDaysForCurrentMonth(UserAccount user, LocalDate today) {
        LocalDate streakEnd = today.equals(user.getLastDailyClaimDate()) ? today : today.minusDays(1);
        LocalDate streakStart = streakEnd.minusDays(Math.max(0, user.getStreak() - 1));
        List<Integer> days = new ArrayList<>();
        for (LocalDate d = streakStart; !d.isAfter(streakEnd); d = d.plusDays(1)) {
            if (d.getYear() == today.getYear() && d.getMonth() == today.getMonth()) {
                days.add(d.getDayOfMonth());
            }
        }
        return days;
    }

    private List<Integer> shieldedDaysForCurrentMonth(UserAccount user, LocalDate today) {
        List<Integer> days = new ArrayList<>();
        LocalDate shielded = user.getLastShieldUsedDate();
        if (shielded != null && shielded.getYear() == today.getYear() && shielded.getMonth() == today.getMonth()) {
            days.add(shielded.getDayOfMonth());
        }
        return days;
    }
}
