package com.learnershigh.rewards.controller;

import com.learnershigh.rewards.dto.ApiDtos.*;
import com.learnershigh.rewards.entity.UserAccount;
import com.learnershigh.rewards.service.ShopService;
import com.learnershigh.rewards.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shop")
public class ShopController {
    private final UserService users;
    private final ShopService shop;

    public ShopController(UserService users, ShopService shop) {
        this.users = users;
        this.shop = shop;
    }

    @GetMapping("/items")
    public List<ShopItemResponse> items() {
        return shop.items();
    }

    @PostMapping("/exchange")
    public ExchangeResponse exchange(
            @RequestHeader(value = "X-Demo-User", required = false) String externalId,
            @Valid @RequestBody ExchangeRequest request
    ) {
        UserAccount user = users.getOrCreate(externalId);
        return shop.exchange(user, request.itemId());
    }

    @GetMapping("/exchange-logs")
    public List<ExchangeLogResponse> logs(@RequestHeader(value = "X-Demo-User", required = false) String externalId) {
        UserAccount user = users.getOrCreate(externalId);
        return shop.logs(user);
    }
}
