package com.learnershigh.rewards.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class HallWinner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private UserAccount user;

    @Column(nullable = false, length = 120)
    private String prizeName;

    @Column(nullable = false, length = 20)
    private String prizeEmoji;

    @Column(nullable = false)
    private int streakDays;

    @Column(nullable = false)
    private LocalDateTime wonAt;

    public Long getId() { return id; }
    public UserAccount getUser() { return user; }
    public void setUser(UserAccount user) { this.user = user; }
    public String getPrizeName() { return prizeName; }
    public void setPrizeName(String prizeName) { this.prizeName = prizeName; }
    public String getPrizeEmoji() { return prizeEmoji; }
    public void setPrizeEmoji(String prizeEmoji) { this.prizeEmoji = prizeEmoji; }
    public int getStreakDays() { return streakDays; }
    public void setStreakDays(int streakDays) { this.streakDays = streakDays; }
    public LocalDateTime getWonAt() { return wonAt; }
    public void setWonAt(LocalDateTime wonAt) { this.wonAt = wonAt; }
}
