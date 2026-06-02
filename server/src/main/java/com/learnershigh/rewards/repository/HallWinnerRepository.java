package com.learnershigh.rewards.repository;

import com.learnershigh.rewards.entity.HallWinner;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HallWinnerRepository extends JpaRepository<HallWinner, Long> {
    List<HallWinner> findTop20ByOrderByWonAtDesc();
    long countByWonAtBetween(LocalDateTime start, LocalDateTime end);
}
