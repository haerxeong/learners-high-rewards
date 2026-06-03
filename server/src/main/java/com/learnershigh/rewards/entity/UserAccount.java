package com.learnershigh.rewards.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class UserAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    @Column(nullable = false, unique = true, length = 80)
    private String externalId;

    @Column(nullable = false, length = 80)
    private String displayName;

    @Column(nullable = false)
    private int shards;

    @Column(nullable = false)
    private int streak;

    @Column(nullable = false)
    private int shields;

    private LocalDate lastDailyClaimDate;

    private LocalDate lastShieldUsedDate;

    @Column(nullable = false)
    private boolean pendingBigSpin;

    public Long getId() { return id; }
    public String getExternalId() { return externalId; }
    public void setExternalId(String externalId) { this.externalId = externalId; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public int getShards() { return shards; }
    public void setShards(int shards) { this.shards = shards; }
    public int getStreak() { return streak; }
    public void setStreak(int streak) { this.streak = streak; }
    public int getShields() { return shields; }
    public void setShields(int shields) { this.shields = shields; }
    public LocalDate getLastDailyClaimDate() { return lastDailyClaimDate; }
    public void setLastDailyClaimDate(LocalDate lastDailyClaimDate) { this.lastDailyClaimDate = lastDailyClaimDate; }
    public LocalDate getLastShieldUsedDate() { return lastShieldUsedDate; }
    public void setLastShieldUsedDate(LocalDate lastShieldUsedDate) { this.lastShieldUsedDate = lastShieldUsedDate; }
    public boolean isPendingBigSpin() { return pendingBigSpin; }
    public void setPendingBigSpin(boolean pendingBigSpin) { this.pendingBigSpin = pendingBigSpin; }
}
