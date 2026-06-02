package com.learnershigh.rewards.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class InventoryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private UserAccount user;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 20)
    private String emoji;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Grade grade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InventoryStatus status;

    @Column(nullable = false)
    private LocalDate receivedDate;

    @Column(nullable = false)
    private LocalDate expiresDate;

    private LocalDateTime usedAt;

    public Long getId() { return id; }
    public UserAccount getUser() { return user; }
    public void setUser(UserAccount user) { this.user = user; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }
    public Grade getGrade() { return grade; }
    public void setGrade(Grade grade) { this.grade = grade; }
    public InventoryStatus getStatus() { return status; }
    public void setStatus(InventoryStatus status) { this.status = status; }
    public LocalDate getReceivedDate() { return receivedDate; }
    public void setReceivedDate(LocalDate receivedDate) { this.receivedDate = receivedDate; }
    public LocalDate getExpiresDate() { return expiresDate; }
    public void setExpiresDate(LocalDate expiresDate) { this.expiresDate = expiresDate; }
    public LocalDateTime getUsedAt() { return usedAt; }
    public void setUsedAt(LocalDateTime usedAt) { this.usedAt = usedAt; }
}
