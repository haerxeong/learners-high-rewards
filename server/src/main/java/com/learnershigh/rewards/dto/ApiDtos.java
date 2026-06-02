package com.learnershigh.rewards.dto;

import com.learnershigh.rewards.entity.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public final class ApiDtos {
    private ApiDtos() {}

    public record UserStateResponse(
            long userId,
            String displayName,
            int shards,
            int streak,
            int shields,
            boolean claimedToday,
            boolean pendingBigSpin,
            long usableInventoryCount
    ) {}

    public record RewardItemResponse(
            long id,
            String name,
            String emoji,
            Grade grade,
            RewardKind kind,
            int shardAmount
    ) {}

    public record AdminRewardItemResponse(
            long id,
            String name,
            String emoji,
            Grade grade,
            RewardKind kind,
            int shardAmount,
            int weight,
            boolean active
    ) {}

    public record DailyClaimRequest(String reflection) {}

    public record DailyClaimResponse(UserStateResponse state, RewardItemResponse reward) {}

    public record BigSpinResponse(UserStateResponse state, HallWinnerResponse prize) {}

    public record ShopItemResponse(
            long id,
            String name,
            String emoji,
            Grade grade,
            int price,
            String category,
            int stock,
            boolean sold
    ) {}

    public record AdminShopItemResponse(
            long id,
            String name,
            String emoji,
            Grade grade,
            int price,
            String category,
            int stock,
            boolean active
    ) {}

    public record ExchangeRequest(@NotNull Long itemId) {}

    public record ExchangeResponse(UserStateResponse state, InventoryItemResponse item, ExchangeLogResponse log) {}

    public record InventoryItemResponse(
            long id,
            String name,
            String emoji,
            Grade grade,
            InventoryStatus status,
            LocalDate receivedDate,
            LocalDate expiresDate
    ) {}

    public record RewardLogResponse(long id, Grade grade, String name, LocalDateTime createdAt) {}

    public record ExchangeLogResponse(long id, String itemName, int usedShards, String status, LocalDateTime createdAt) {}

    public record HallWinnerResponse(
            long id,
            String maskedName,
            String org,
            String prizeName,
            String prizeEmoji,
            int streakDays,
            LocalDateTime wonAt
    ) {}

    public record StudySummaryResponse(
            LocalDate today,
            String monthLabel,
            int todayStudyMinutes,
            int goalMinutes,
            int monthlyAchievementRate,
            int rewardAvailableCount,
            List<Integer> achievedDays,
            List<Integer> shieldedDays
    ) {}

    public record ShieldUseResponse(UserStateResponse state, StudySummaryResponse study) {}

    public record RewardPoolUpdateRequest(@NotNull Integer weight, @NotNull Boolean active) {}

    public record ShopItemUpdateRequest(@NotNull Integer price, @NotNull Integer stock, @NotNull Boolean active) {}
}
