package com.learnershigh.rewards.repository;

import com.learnershigh.rewards.entity.UserAccount;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByExternalId(String externalId);
}
