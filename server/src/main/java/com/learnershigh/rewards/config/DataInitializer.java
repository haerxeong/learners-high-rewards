package com.learnershigh.rewards.config;

import com.learnershigh.rewards.entity.*;
import com.learnershigh.rewards.repository.*;
import java.time.LocalDateTime;
import java.time.ZoneId;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {
    private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");

    private final UserAccountRepository users;
    private final RewardItemRepository rewardItems;
    private final ShopItemRepository shopItems;
    private final BigPrizeRepository bigPrizes;
    private final HallWinnerRepository hallWinners;

    public DataInitializer(
            UserAccountRepository users,
            RewardItemRepository rewardItems,
            ShopItemRepository shopItems,
            BigPrizeRepository bigPrizes,
            HallWinnerRepository hallWinners
    ) {
        this.users = users;
        this.rewardItems = rewardItems;
        this.shopItems = shopItems;
        this.bigPrizes = bigPrizes;
        this.hallWinners = hallWinners;
    }

    @Override
    @Transactional
    public void run(String... args) {
        UserAccount demo = users.findByExternalId("demo-dain").orElseGet(() -> {
            UserAccount user = new UserAccount();
            user.setExternalId("demo-dain");
            user.setDisplayName("다인 학생");
            user.setShards(127);
            user.setStreak(23);
            user.setShields(2);
            return users.save(user);
        });

        if (rewardItems.count() == 0) {
            reward("성장 조각 +12", "🌱", Grade.COMMON, RewardKind.SHARDS, 12, 420);
            reward("성장 조각 +8", "🌱", Grade.COMMON, RewardKind.SHARDS, 8, 280);
            reward("레어 조각 +25", "💧", Grade.RARE, RewardKind.SHARDS, 25, 160);
            reward("편의점 1천원권", "🏪", Grade.RARE, RewardKind.COUPON, 0, 70);
            reward("에픽 조각 +60", "🔮", Grade.EPIC, RewardKind.SHARDS, 60, 35);
            reward("베스킨라빈스 파인트", "🍨", Grade.EPIC, RewardKind.COUPON, 0, 15);
            reward("BIG 리워드 진입", "✨", Grade.BIG, RewardKind.BIG_ENTRY, 0, 20);
        }

        if (shopItems.count() == 0) {
            shop("스타벅스 아메리카노", "☕", Grade.COMMON, 100, "음식", 842);
            shop("편의점 기프티콘 5천원", "🏪", Grade.COMMON, 100, "음식", 1203);
            shop("베스킨라빈스 파인트", "🍨", Grade.RARE, 200, "음식", 318);
            shop("CGV 영화 관람권", "🎬", Grade.RARE, 250, "문화", 0);
            shop("치킨 기프티콘", "🍗", Grade.EPIC, 500, "음식", 64);
            shop("피자 기프티콘", "🍕", Grade.EPIC, 600, "음식", 41);
            shop("애플 에어팟", "🎧", Grade.BIG, 5000, "전자기기", 12);
            shop("백화점 상품권 10만원", "🏬", Grade.BIG, 10000, "문화", 5);
        }

        if (bigPrizes.count() == 0) {
            big("에어팟 4세대", "🎧", 60, 12);
            big("아이패드", "📱", 15, 6);
            big("에어팟 맥스", "🎧", 15, 6);
            big("아이패드 프로", "📱", 10, 2);
        }

        if (hallWinners.count() == 0) {
            hall(demo, "아이패드 프로", "📱", 41, 2);
            hall(demo, "에어팟 4세대", "🎧", 28, 5);
            hall(demo, "에어팟 맥스", "🎧", 36, 6);
        }
    }

    private void reward(String name, String emoji, Grade grade, RewardKind kind, int shardAmount, int weight) {
        RewardItem item = new RewardItem();
        item.setName(name);
        item.setEmoji(emoji);
        item.setGrade(grade);
        item.setKind(kind);
        item.setShardAmount(shardAmount);
        item.setWeight(weight);
        item.setActive(true);
        rewardItems.save(item);
    }

    private void shop(String name, String emoji, Grade grade, int price, String category, int stock) {
        ShopItem item = new ShopItem();
        item.setName(name);
        item.setEmoji(emoji);
        item.setGrade(grade);
        item.setPrice(price);
        item.setCategory(category);
        item.setStock(stock);
        item.setActive(true);
        shopItems.save(item);
    }

    private void big(String name, String emoji, int weight, int stock) {
        BigPrize prize = new BigPrize();
        prize.setName(name);
        prize.setEmoji(emoji);
        prize.setWeight(weight);
        prize.setStock(stock);
        prize.setActive(true);
        bigPrizes.save(prize);
    }

    private void hall(UserAccount user, String prizeName, String emoji, int streakDays, int daysAgo) {
        HallWinner winner = new HallWinner();
        winner.setUser(user);
        winner.setPrizeName(prizeName);
        winner.setPrizeEmoji(emoji);
        winner.setStreakDays(streakDays);
        winner.setWonAt(LocalDateTime.now(ZONE).minusDays(daysAgo));
        hallWinners.save(winner);
    }
}
