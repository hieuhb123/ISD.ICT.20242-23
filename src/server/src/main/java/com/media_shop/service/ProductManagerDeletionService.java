package com.media_shop.service;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ProductManagerDeletionService {
    private static final int MAX_DAILY_DELETIONS = 30;

    // Use a concurrent map to handle multiple users and threads safely
    private final Map<String, Map<LocalDate, Integer>> dailyDeletions = new ConcurrentHashMap<>();

    public void checkDeletionLimit(String userId, int numberOfProductsToDelete) {
        LocalDate today = LocalDate.now();
        int currentDailyDeletions = getDailyDeletions(userId, today);

        if (currentDailyDeletions + numberOfProductsToDelete > MAX_DAILY_DELETIONS) {
            throw new IllegalStateException("Daily deletion limit exceeded for user " + userId +
                    ". Current deletions: " + currentDailyDeletions +
                    ", Attempted: " + numberOfProductsToDelete +
                    ", Max allowed: " + MAX_DAILY_DELETIONS);
        }
    }

    public void updateDeletionCount(String userId, int numberOfProductsToDelete) {
        LocalDate today = LocalDate.now();
        dailyDeletions.compute(userId, (key, userDeletions) -> {
            if (userDeletions == null) {
                userDeletions = new ConcurrentHashMap<>();
            }
            userDeletions.compute(today, (dateKey, count) -> (count == null ? 0 : count) + numberOfProductsToDelete);
            return userDeletions;
        });
    }

    private int getDailyDeletions(String userId, LocalDate date) {
        return dailyDeletions.getOrDefault(userId, java.util.Collections.emptyMap()).getOrDefault(date, 0);
    }

    // Method to reset daily counts (for example, you could schedule this to run daily at midnight)
    @org.springframework.scheduling.annotation.Scheduled(cron = "0 0 0 * * ?") // Run at midnight every day
    public void resetDailyCounts() {
        dailyDeletions.clear();
    }
}

    // Additional method to get the current count, for testing/debugging
    public int getCurrentDailyDeletions(String userId) {
        return getDailyDeletions(userId, LocalDate.now());
    }
}