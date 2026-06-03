package com.learnershigh.rewards.repository;

import com.learnershigh.rewards.entity.RewardItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RewardItemRepository extends JpaRepository<RewardItem, Long> {
    List<RewardItem> findByActiveTrue();
}
