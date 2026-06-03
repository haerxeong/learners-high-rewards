package com.learnershigh.rewards.entity;

import jakarta.persistence.*;

@Entity
public class RewardItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 20)
    private String emoji;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Grade grade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RewardKind kind;

    @Column(nullable = false)
    private int shardAmount;

    @Column(nullable = false)
    private int weight;

    @Column(nullable = false)
    private boolean active;

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }
    public Grade getGrade() { return grade; }
    public void setGrade(Grade grade) { this.grade = grade; }
    public RewardKind getKind() { return kind; }
    public void setKind(RewardKind kind) { this.kind = kind; }
    public int getShardAmount() { return shardAmount; }
    public void setShardAmount(int shardAmount) { this.shardAmount = shardAmount; }
    public int getWeight() { return weight; }
    public void setWeight(int weight) { this.weight = weight; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
