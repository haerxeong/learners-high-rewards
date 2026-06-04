package com.learnershigh.rewards.controller;

import com.learnershigh.rewards.dto.ApiDtos.*;
import com.learnershigh.rewards.entity.Grade;
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

    @PostMapping("/shop-items")
    @Transactional
    public AdminShopItemResponse createShopItem(@Valid @RequestBody ShopItemCreateRequest request) {
        if (request.name().isBlank() || request.emoji().isBlank() || request.category().isBlank()) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "상품명, 이모지, 카테고리는 필수입니다.");
        }
        if (request.price() < 0 || request.stock() < 0) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "가격과 재고는 0 이상이어야 합니다.");
        }

        ShopItem item = new ShopItem();
        item.setName(request.name().trim());
        item.setEmoji(request.emoji().trim());
        item.setGrade(parseGrade(request.grade()));
        item.setPrice(request.price());
        item.setCategory(request.category().trim());
        item.setStock(request.stock());
        item.setActive(request.active());
        return toAdminShopItem(shopItems.save(item));
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

    @DeleteMapping("/shop-items/{id}")
    @Transactional
    public void deleteShopItem(@PathVariable long id) {
        if (!shopItems.existsById(id)) {
            throw new BusinessException(HttpStatus.NOT_FOUND, "상품을 찾을 수 없습니다.");
        }
        shopItems.deleteById(id);
    }

    private Grade parseGrade(String grade) {
        try {
            return Grade.valueOf(grade.trim().toUpperCase());
        } catch (RuntimeException e) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "지원하지 않는 등급입니다.");
        }
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
