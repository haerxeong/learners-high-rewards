package com.learnershigh.rewards.controller;

import com.learnershigh.rewards.dto.ApiDtos.*;
import com.learnershigh.rewards.entity.RewardItem;
import com.learnershigh.rewards.entity.ShopItem;
import com.learnershigh.rewards.repository.RewardItemRepository;
import com.learnershigh.rewards.repository.ShopItemRepository;
import com.learnershigh.rewards.service.BusinessException;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final RewardItemRepository rewardItems;
    private final ShopItemRepository shopItems;

    public AdminController(RewardItemRepository rewardItems, ShopItemRepository shopItems) {
        this.rewardItems = rewardItems;
        this.shopItems = shopItems;
    }

    @GetMapping("/reward-pool")
    public List<AdminRewardItemResponse> rewardPool() {
        return rewardItems.findAll().stream()
                .map(this::toAdminReward)
                .toList();
    }

    @PatchMapping("/reward-pool/{id}")
    @Transactional
    public AdminRewardItemResponse updateReward(@PathVariable long id, @Valid @RequestBody RewardPoolUpdateRequest request) {
        RewardItem item = rewardItems.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "보상 항목을 찾을 수 없습니다."));
        if (request.weight() < 0) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "가중치는 0 이상이어야 합니다.");
        }
        item.setWeight(request.weight());
        item.setActive(request.active());
        return toAdminReward(rewardItems.save(item));
    }

    @GetMapping("/shop-items")
    public List<AdminShopItemResponse> shopItems() {
        return shopItems.findAll().stream().map(this::toAdminShopItem).toList();
    }

    @PatchMapping("/shop-items/{id}")
    @Transactional
    public AdminShopItemResponse updateShopItem(@PathVariable long id, @Valid @RequestBody ShopItemUpdateRequest request) {
        ShopItem item = shopItems.findById(id)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "상품을 찾을 수 없습니다."));
        if (request.price() < 0 || request.stock() < 0) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "가격과 재고는 0 이상이어야 합니다.");
        }
        item.setPrice(request.price());
        item.setStock(request.stock());
        item.setActive(request.active());
        return toAdminShopItem(shopItems.save(item));
    }

    private AdminRewardItemResponse toAdminReward(RewardItem item) {
        return new AdminRewardItemResponse(
                item.getId(),
                item.getName(),
                item.getEmoji(),
                item.getGrade(),
                item.getKind(),
                item.getShardAmount(),
                item.getWeight(),
                item.isActive()
        );
    }

    private AdminShopItemResponse toAdminShopItem(ShopItem saved) {
        return new AdminShopItemResponse(
                saved.getId(),
                saved.getName(),
                saved.getEmoji(),
                saved.getGrade(),
                saved.getPrice(),
                saved.getCategory(),
                saved.getStock(),
                saved.isActive()
        );
    }
}
