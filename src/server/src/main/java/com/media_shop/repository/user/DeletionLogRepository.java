package com.media_shop.repository.user;

import com.media_shop.entity.user.DeletionLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface DeletionLogRepository extends MongoRepository<DeletionLog, String> {

    /**
     * Counts documents by the manager's ID created after a specific time.
     */
    long countByManagerIdAndDeletedAtAfter(String managerId, LocalDateTime startTime);
}