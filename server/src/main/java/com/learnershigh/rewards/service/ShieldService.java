package com.learnershigh.rewards.service;

import com.learnershigh.rewards.dto.ApiDtos.ShieldUseResponse;
import com.learnershigh.rewards.entity.UserAccount;
import com.learnershigh.rewards.repository.UserAccountRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ShieldService {
    private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");

    private final UserAccountRepository users;
    private final UserService userService;
    private final StudyService studyService;

    public ShieldService(UserAccountRepository users, UserService userService, StudyService studyService) {
        this.users = users;
        this.userService = userService;
        this.studyService = studyService;
    }

    @Transactional
    public ShieldUseResponse useToday(UserAccount user) {
        LocalDate today = LocalDate.now(ZONE);
        if (today.equals(user.getLastShieldUsedDate())) {
            throw new BusinessException(HttpStatus.CONFLICT, "오늘은 이미 보호막을 사용했습니다.");
        }
        if (today.equals(user.getLastDailyClaimDate())) {
            throw new BusinessException(HttpStatus.CONFLICT, "오늘 목표를 이미 달성해 보호막이 필요하지 않습니다.");
        }
        if (user.getShields() <= 0) {
            throw new BusinessException(HttpStatus.CONFLICT, "사용 가능한 보호막이 없습니다.");
        }

        user.setShields(user.getShields() - 1);
        user.setLastShieldUsedDate(today);
        UserAccount saved = users.save(user);
        return new ShieldUseResponse(userService.toState(saved, today), studyService.summary(saved));
    }
}
