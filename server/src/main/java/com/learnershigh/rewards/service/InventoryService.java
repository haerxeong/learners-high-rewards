package com.learnershigh.rewards.service;

import com.learnershigh.rewards.dto.ApiDtos.InventoryItemResponse;
import com.learnershigh.rewards.entity.InventoryItem;
import com.learnershigh.rewards.entity.InventoryStatus;
import com.learnershigh.rewards.entity.UserAccount;
import com.learnershigh.rewards.repository.InventoryItemRepository;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryService {
    private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");
    private final InventoryItemRepository inventory;

    public InventoryService(InventoryItemRepository inventory) {
        this.inventory = inventory;
    }

    @Transactional(readOnly = true)
    public List<InventoryItemResponse> items(UserAccount user) {
        return inventory.findByUserOrderByReceivedDateDescIdDesc(user).stream()
                .map(ShopService::toInventoryResponse)
                .toList();
    }

    @Transactional
    public InventoryItemResponse use(UserAccount user, long inventoryId) {
        InventoryItem item = inventory.findById(inventoryId)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "보관함 항목을 찾을 수 없습니다."));
        if (!item.getUser().getId().equals(user.getId())) {
            throw new BusinessException(HttpStatus.NOT_FOUND, "보관함 항목을 찾을 수 없습니다.");
        }
        if (item.getStatus() == InventoryStatus.USED) {
            throw new BusinessException(HttpStatus.CONFLICT, "이미 사용한 항목입니다.");
        }
        item.setStatus(InventoryStatus.USED);
        item.setUsedAt(LocalDateTime.now(ZONE));
        return ShopService.toInventoryResponse(inventory.save(item));
    }
}
