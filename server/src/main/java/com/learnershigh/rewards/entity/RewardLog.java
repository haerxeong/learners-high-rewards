package com.learnershigh.rewards.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class RewardLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private UserAccount user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Grade grade;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public UserAccount getUser() { return user; }
    public void setUser(UserAccount user) { this.user = user; }
    public Grade getGrade() { return grade; }
    public void setGrade(Grade grade) { this.grade = grade; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
