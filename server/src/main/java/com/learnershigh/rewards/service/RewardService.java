package com.learnershigh.rewards.service;

import com.learnershigh.rewards.dto.ApiDtos.*;
import com.learnershigh.rewards.entity.*;
import com.learnershigh.rewards.repository.*;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RewardService {
    private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");

    private final RewardItemRepository rewardItems;
    private final RewardLogRepository rewardLogs;
    private final InventoryItemRepository inventory;
    private final BigPrizeRepository bigPrizes;
    private final HallWinnerRepository hallWinners;
    private final UserAccountRepository users;
    private final UserService userService;
    private final SecureRandom random = new SecureRandom();

    public RewardService(
            RewardItemRepository rewardItems,
            RewardLogRepository rewardLogs,
            InventoryItemRepository inventory,
            BigPrizeRepository bigPrizes,
            HallWinnerRepository hallWinners,
            UserAccountRepository users,
            UserService userService
    ) {
        this.rewardItems = rewardItems;
        this.rewardLogs = rewardLogs;
        this.inventory = inventory;
        this.bigPrizes = bigPrizes;
        this.hallWinners = hallWinners;
        this.users = users;
        this.userService = userService;
    }

    @Transactional
    public DailyClaimResponse claimDaily(UserAccount user) {
        LocalDate today = LocalDate.now(ZONE);
        if (today.equals(user.getLastDailyClaimDate())) {
            throw new BusinessException(HttpStatus.CONFLICT, "오늘의 보상은 이미 수령했습니다.");
        }

        RewardItem reward = pickReward();
        user.setLastDailyClaimDate(today);

        if (reward.getKind() == RewardKind.SHARDS) {
            user.setShards(user.getShards() + reward.getShardAmount());
        } else if (reward.getKind() == RewardKind.COUPON) {
            inventory.save(couponInventory(user, reward));
        } else if (reward.getKind() == RewardKind.BIG_ENTRY) {
            user.setPendingBigSpin(true);
        }

        rewardLogs.save(log(user, reward.getGrade(), reward.getName()));
        users.save(user);

        return new DailyClaimResponse(userService.toState(user, today), toRewardResponse(reward));
    }

    @Transactional
    public BigSpinResponse spinBig(UserAccount user) {
        if (!user.isPendingBigSpin()) {
            throw new BusinessException(HttpStatus.CONFLICT, "사용 가능한 BIG 리워드 진입권이 없습니다.");
        }

        BigPrize prize = pickBigPrize();
        prize.setStock(prize.getStock() - 1);
        user.setPendingBigSpin(false);

        HallWinner winner = new HallWinner();
        winner.setUser(user);
        winner.setPrizeName(prize.getName());
        winner.setPrizeEmoji(prize.getEmoji());
        winner.setStreakDays(user.getStreak());
        winner.setWonAt(LocalDateTime.now(ZONE));

        rewardLogs.save(log(user, Grade.BIG, prize.getName() + " 당첨"));
        bigPrizes.save(prize);
        users.save(user);
        HallWinner saved = hallWinners.save(winner);

        return new BigSpinResponse(userService.toState(user, LocalDate.now(ZONE)), toHallWinnerResponse(saved));
    }

    @Transactional(readOnly = true)
    public List<RewardLogResponse> logs(UserAccount user) {
        return rewardLogs.findTop20ByUserOrderByCreatedAtDesc(user).stream()
                .map(l -> new RewardLogResponse(l.getId(), l.getGrade(), l.getName(), l.getCreatedAt()))
                .toList();
    }

    private RewardItem pickReward() {
        List<RewardItem> pool = rewardItems.findByActiveTrue();
        if (pool.isEmpty()) {
            throw new BusinessException(HttpStatus.CONFLICT, "활성화된 보상 풀이 없습니다.");
        }
        int total = pool.stream().mapToInt(RewardItem::getWeight).sum();
        int cursor = random.nextInt(total);
        for (RewardItem item : pool) {
            cursor -= item.getWeight();
            if (cursor < 0) return item;
        }
        return pool.get(pool.size() - 1);
    }

    private BigPrize pickBigPrize() {
        List<BigPrize> pool = bigPrizes.findByActiveTrueAndStockGreaterThan(0);
        if (pool.isEmpty()) {
            throw new BusinessException(HttpStatus.CONFLICT, "현재 BIG 리워드 재고가 없습니다.");
        }
        int total = pool.stream().mapToInt(BigPrize::getWeight).sum();
        int cursor = random.nextInt(total);
        for (BigPrize prize : pool) {
            cursor -= prize.getWeight();
            if (cursor < 0) return prize;
        }
        return pool.get(pool.size() - 1);
    }

    private RewardLog log(UserAccount user, Grade grade, String name) {
        RewardLog log = new RewardLog();
        log.setUser(user);
        log.setGrade(grade);
        log.setName(name);
        log.setCreatedAt(LocalDateTime.now(ZONE));
        return log;
    }

    private InventoryItem couponInventory(UserAccount user, RewardItem reward) {
        LocalDate today = LocalDate.now(ZONE);
        InventoryItem item = new InventoryItem();
        item.setUser(user);
        item.setName(reward.getName());
        item.setEmoji(reward.getEmoji());
        item.setGrade(reward.getGrade());
        item.setStatus(InventoryStatus.USABLE);
        item.setReceivedDate(today);
        item.setExpiresDate(today.plusMonths(6));
        return item;
    }

    private RewardItemResponse toRewardResponse(RewardItem item) {
        return new RewardItemResponse(item.getId(), item.getName(), item.getEmoji(), item.getGrade(), item.getKind(), item.getShardAmount());
    }

    public static HallWinnerResponse toHallWinnerResponse(HallWinner winner) {
        String name = winner.getUser().getDisplayName();
        String masked = name.length() <= 1 ? name : name.charAt(0) + "○○";
        return new HallWinnerResponse(
                winner.getId(),
                masked,
                "개인 학습자",
                winner.getPrizeName(),
                winner.getPrizeEmoji(),
                winner.getStreakDays(),
                winner.getWonAt()
        );
    }
}
