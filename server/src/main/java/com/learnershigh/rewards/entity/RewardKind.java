package com.learnershigh.rewards.entity;

import com.fasterxml.jackson.annotation.JsonValue;

public enum RewardKind {
    SHARDS,
    COUPON,
    BIG_ENTRY;

    @JsonValue
    public String json() {
        return name().toLowerCase();
    }
}
