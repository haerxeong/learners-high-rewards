package com.learnershigh.rewards.service;

import com.learnershigh.rewards.dto.ApiDtos.UserStateResponse;
import com.learnershigh.rewards.entity.InventoryStatus;
import com.learnershigh.rewards.entity.UserAccount;
import com.learnershigh.rewards.repository.InventoryItemRepository;
import com.learnershigh.rewards.repository.UserAccountRepository;
import java.time.LocalDate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private final UserAccountRepository users;
    private final InventoryItemRepository inventory;

    public UserService(UserAccountRepository users, InventoryItemRepository inventory) {
        this.users = users;
        this.inventory = inventory;
    }

    @Transactional
    public UserAccount getOrCreate(String externalId) {
        String id = externalId == null || externalId.isBlank() ? "demo-dain" : externalId.trim();
        return users.findByExternalId(id).orElseGet(() -> {
            UserAccount user = new UserAccount();
            user.setExternalId(id);
            user.setDisplayName("다인 학생");
            user.setShards(127);
            user.setStreak(23);
            user.setShields(2);
            return users.save(user);
        });
    }

    public UserStateResponse toState(UserAccount user, LocalDate today) {
        boolean claimedToday = today.equals(user.getLastDailyClaimDate());
        long usableCount = inventory.countByUserAndStatus(user, InventoryStatus.USABLE);
        return new UserStateResponse(
                user.getId(),
                user.getDisplayName(),
                user.getShards(),
                user.getStreak(),
                user.getShields(),
                claimedToday,
                user.isPendingBigSpin(),
                usableCount
        );
    }
}
