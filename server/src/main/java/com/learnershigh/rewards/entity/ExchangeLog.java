package com.learnershigh.rewards.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ExchangeLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private UserAccount user;

    @Column(nullable = false, length = 120)
    private String itemName;

    @Column(nullable = false)
    private int usedShards;

    @Column(nullable = false, length = 40)
    private String status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public UserAccount getUser() { return user; }
    public void setUser(UserAccount user) { this.user = user; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public int getUsedShards() { return usedShards; }
    public void setUsedShards(int usedShards) { this.usedShards = usedShards; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
