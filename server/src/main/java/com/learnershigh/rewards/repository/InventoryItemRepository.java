package com.learnershigh.rewards.repository;

import com.learnershigh.rewards.entity.InventoryItem;
import com.learnershigh.rewards.entity.InventoryStatus;
import com.learnershigh.rewards.entity.UserAccount;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findByUserOrderByReceivedDateDescIdDesc(UserAccount user);
    long countByUserAndStatus(UserAccount user, InventoryStatus status);
    void deleteByUser(UserAccount user);
}
