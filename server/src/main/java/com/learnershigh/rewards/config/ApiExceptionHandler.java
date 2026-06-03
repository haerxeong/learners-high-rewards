package com.learnershigh.rewards.config;

import com.learnershigh.rewards.service.BusinessException;
import java.util.Map;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(BusinessException.class)
    ResponseEntity<Map<String, String>> handleBusiness(BusinessException e) {
        return ResponseEntity.status(e.getStatus()).body(Map.of("message", e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException e) {
        return ResponseEntity.badRequest().body(Map.of("message", "요청 값이 올바르지 않습니다."));
    }

    @ExceptionHandler(OptimisticLockingFailureException.class)
    ResponseEntity<Map<String, String>> handleOptimisticLock(OptimisticLockingFailureException e) {
        return ResponseEntity.status(409).body(Map.of("message", "동시에 처리된 요청이 있어 다시 시도해 주세요."));
    }
}
