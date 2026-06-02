package com.learnershigh.rewards.repository;

import com.learnershigh.rewards.entity.ExchangeLog;
import com.learnershigh.rewards.entity.UserAccount;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExchangeLogRepository extends JpaRepository<ExchangeLog, Long> {
    List<ExchangeLog> findTop20ByUserOrderByCreatedAtDesc(UserAccount user);
}
