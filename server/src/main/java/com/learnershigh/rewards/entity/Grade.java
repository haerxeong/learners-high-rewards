package com.learnershigh.rewards.entity;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Grade {
    COMMON,
    RARE,
    EPIC,
    BIG;

    @JsonValue
    public String json() {
        return name().toLowerCase();
    }
}
