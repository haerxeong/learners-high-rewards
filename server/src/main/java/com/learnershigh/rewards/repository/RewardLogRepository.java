package com.learnershigh.rewards.repository;

import com.learnershigh.rewards.entity.RewardLog;
import com.learnershigh.rewards.entity.UserAccount;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RewardLogRepository extends JpaRepository<RewardLog, Long> {
    List<RewardLog> findTop20ByUserOrderByCreatedAtDesc(UserAccount user);
}
