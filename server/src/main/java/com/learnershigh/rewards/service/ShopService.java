package com.learnershigh.rewards.service;

import com.learnershigh.rewards.dto.ApiDtos.*;
import com.learnershigh.rewards.entity.*;
import com.learnershigh.rewards.repository.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ShopService {
    private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");

    private final ShopItemRepository shopItems;
    private final InventoryItemRepository inventory;
    private final ExchangeLogRepository exchangeLogs;
    private final UserAccountRepository users;
    private final UserService userService;

    public ShopService(
            ShopItemRepository shopItems,
            InventoryItemRepository inventory,
            ExchangeLogRepository exchangeLogs,
            UserAccountRepository users,
            UserService userService
    ) {
        this.shopItems = shopItems;
        this.inventory = inventory;
        this.exchangeLogs = exchangeLogs;
        this.users = users;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public List<ShopItemResponse> items() {
        return shopItems.findByActiveTrueOrderByIdAsc().stream().map(this::toShopItemResponse).toList();
    }

    @Transactional
    public ExchangeResponse exchange(UserAccount user, long itemId) {
        ShopItem item = shopItems.findById(itemId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "상품을 찾을 수 없습니다."));
        if (!item.isActive()) {
            throw new BusinessException(HttpStatus.CONFLICT, "비활성화된 상품입니다.");
        }
        if (item.getStock() <= 0) {
            throw new BusinessException(HttpStatus.CONFLICT, "품절된 상품입니다.");
        }
        if (user.getShards() < item.getPrice()) {
            throw new BusinessException(HttpStatus.CONFLICT, "조각이 부족합니다.");
        }

        user.setShards(user.getShards() - item.getPrice());
        item.setStock(item.getStock() - 1);

        InventoryItem inv = new InventoryItem();
        inv.setUser(user);
        inv.setName(item.getName());
        inv.setEmoji(item.getEmoji());
        inv.setGrade(item.getGrade());
        inv.setStatus(InventoryStatus.USABLE);
        inv.setReceivedDate(LocalDate.now(ZONE));
        inv.setExpiresDate(LocalDate.now(ZONE).plusMonths(6));

        ExchangeLog log = new ExchangeLog();
        log.setUser(user);
        log.setItemName(item.getName());
        log.setUsedShards(item.getPrice());
        log.setStatus("보관함");
        log.setCreatedAt(LocalDateTime.now(ZONE));

        users.save(user);
        shopItems.save(item);
        InventoryItem savedInv = inventory.save(inv);
        ExchangeLog savedLog = exchangeLogs.save(log);

        return new ExchangeResponse(userService.toState(user, LocalDate.now(ZONE)), toInventoryResponse(savedInv), toExchangeLogResponse(savedLog));
    }

    @Transactional(readOnly = true)
    public List<ExchangeLogResponse> logs(UserAccount user) {
        return exchangeLogs.findTop20ByUserOrderByCreatedAtDesc(user).stream().map(this::toExchangeLogResponse).toList();
    }

    private ShopItemResponse toShopItemResponse(ShopItem item) {
        return new ShopItemResponse(
                item.getId(),
                item.getName(),
                item.getEmoji(),
                item.getGrade(),
                item.getPrice(),
                item.getCategory(),
                item.getStock(),
                item.getStock() <= 0
        );
    }

    static InventoryItemResponse toInventoryResponse(InventoryItem item) {
        return new InventoryItemResponse(
                item.getId(),
                item.getName(),
                item.getEmoji(),
                item.getGrade(),
                item.getStatus(),
                item.getReceivedDate(),
                item.getExpiresDate()
        );
    }

    private ExchangeLogResponse toExchangeLogResponse(ExchangeLog log) {
        return new ExchangeLogResponse(log.getId(), log.getItemName(), log.getUsedShards(), log.getStatus(), log.getCreatedAt());
    }
}
