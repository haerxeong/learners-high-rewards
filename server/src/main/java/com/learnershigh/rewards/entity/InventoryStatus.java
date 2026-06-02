package com.learnershigh.rewards.entity;

import com.fasterxml.jackson.annotation.JsonValue;

public enum InventoryStatus {
    USABLE,
    USED;

    @JsonValue
    public String json() {
        return name().toLowerCase();
    }
}
