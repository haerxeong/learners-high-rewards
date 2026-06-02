package com.learnershigh.rewards.controller;

import com.learnershigh.rewards.dto.ApiDtos.InventoryItemResponse;
import com.learnershigh.rewards.entity.UserAccount;
import com.learnershigh.rewards.service.InventoryService;
import com.learnershigh.rewards.service.UserService;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    private final UserService users;
    private final InventoryService inventory;

    public InventoryController(UserService users, InventoryService inventory) {
        this.users = users;
        this.inventory = inventory;
    }

    @GetMapping
    public List<InventoryItemResponse> items(@RequestHeader(value = "X-Demo-User", required = false) String externalId) {
        UserAccount user = users.getOrCreate(externalId);
        return inventory.items(user);
    }

    @PostMapping("/{id}/use")
    public InventoryItemResponse use(
            @RequestHeader(value = "X-Demo-User", required = false) String externalId,
            @PathVariable long id
    ) {
        UserAccount user = users.getOrCreate(externalId);
        return inventory.use(user, id);
    }
}
