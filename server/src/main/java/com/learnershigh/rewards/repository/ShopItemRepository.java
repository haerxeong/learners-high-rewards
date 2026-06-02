package com.learnershigh.rewards.repository;

import com.learnershigh.rewards.entity.ShopItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShopItemRepository extends JpaRepository<ShopItem, Long> {
    List<ShopItem> findByActiveTrueOrderByIdAsc();
}
