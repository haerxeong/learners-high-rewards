package com.learnershigh.rewards.service;

import com.learnershigh.rewards.dto.ApiDtos.UserStateResponse;
import com.learnershigh.rewards.entity.*;
import com.learnershigh.rewards.repository.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DemoService {
    private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");

    private final UserService userService;
    private final UserAccountRepository users;
    private final InventoryItemRepository inventory;
    private final RewardLogRepository rewardLogs;
    private final ExchangeLogRepository exchangeLogs;

    public DemoService(
            UserService userService,
            UserAccountRepository users,
            InventoryItemRepository inventory,
            RewardLogRepository rewardLogs,
            ExchangeLogRepository exchangeLogs
    ) {
        this.userService = userService;
        this.users = users;
        this.inventory = inventory;
        this.rewardLogs = rewardLogs;
        this.exchangeLogs = exchangeLogs;
    }

    @Transactional
    public UserStateResponse reset(String externalId) {
        UserAccount user = userService.getOrCreate(externalId);
        rewardLogs.deleteByUser(user);
        exchangeLogs.deleteByUser(user);
        inventory.deleteByUser(user);

        user.setDisplayName("다인 학생");
        user.setShards(350);
        user.setStreak(23);
        user.setShields(2);
        user.setLastDailyClaimDate(null);
        user.setLastShieldUsedDate(null);
        user.setPendingBigSpin(false);
        UserAccount saved = users.save(user);

        seedReward(saved, Grade.RARE, "레어 조각 +25", 1, 21, 40);
        seedReward(saved, Grade.COMMON, "성장 조각 +10", 2, 22, 5);
        seedReward(saved, Grade.EPIC, "에픽 조각 +60", 3, 20, 18);
        seedReward(saved, Grade.COMMON, "성장 조각 +8", 4, 21, 12);

        seedInventory(saved, "편의점 기프티콘 5천원", "🏪", Grade.COMMON, 12, InventoryStatus.USABLE);
        seedInventory(saved, "베스킨라빈스 파인트", "🍨", Grade.RARE, 21, InventoryStatus.USABLE);
        seedInventory(saved, "스타벅스 아메리카노", "☕", Grade.COMMON, 5, InventoryStatus.USED);

        seedExchange(saved, "스타벅스 아메리카노", 100, "사용 완료", 5);
        seedExchange(saved, "편의점 기프티콘 5천원", 100, "보관함", 12);
        seedExchange(saved, "베스킨라빈스 파인트", 200, "보관함", 21);

        return userService.toState(saved, LocalDate.now(ZONE));
    }

    private void seedReward(UserAccount user, Grade grade, String name, int daysAgo, int hour, int minute) {
        RewardLog log = new RewardLog();
        log.setUser(user);
        log.setGrade(grade);
        log.setName(name);
        log.setCreatedAt(LocalDate.now(ZONE).minusDays(daysAgo).atTime(hour, minute));
        rewardLogs.save(log);
    }

    private void seedInventory(UserAccount user, String name, String emoji, Grade grade, int daysAgo, InventoryStatus status) {
        LocalDate received = LocalDate.now(ZONE).minusDays(daysAgo);
        InventoryItem item = new InventoryItem();
        item.setUser(user);
        item.setName(name);
        item.setEmoji(emoji);
        item.setGrade(grade);
        item.setStatus(status);
        item.setReceivedDate(received);
        item.setExpiresDate(received.plusMonths(6));
        if (status == InventoryStatus.USED) {
            item.setUsedAt(LocalDateTime.now(ZONE).minusDays(2));
        }
        inventory.save(item);
    }

    private void seedExchange(UserAccount user, String itemName, int usedShards, String status, int daysAgo) {
        ExchangeLog log = new ExchangeLog();
        log.setUser(user);
        log.setItemName(itemName);
        log.setUsedShards(usedShards);
        log.setStatus(status);
        log.setCreatedAt(LocalDateTime.now(ZONE).minusDays(daysAgo));
        exchangeLogs.save(log);
    }
}
