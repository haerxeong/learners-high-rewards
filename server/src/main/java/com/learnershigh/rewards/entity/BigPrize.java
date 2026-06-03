package com.learnershigh.rewards.entity;

import jakarta.persistence.*;

@Entity
public class BigPrize {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 20)
    private String emoji;

    @Column(nullable = false)
    private int weight;

    @Column(nullable = false)
    private int stock;

    @Column(nullable = false)
    private boolean active;

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }
    public int getWeight() { return weight; }
    public void setWeight(int weight) { this.weight = weight; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
