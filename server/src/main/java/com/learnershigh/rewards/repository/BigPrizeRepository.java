package com.learnershigh.rewards.repository;

import com.learnershigh.rewards.entity.BigPrize;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BigPrizeRepository extends JpaRepository<BigPrize, Long> {
    List<BigPrize> findByActiveTrueAndStockGreaterThan(int stock);
}
