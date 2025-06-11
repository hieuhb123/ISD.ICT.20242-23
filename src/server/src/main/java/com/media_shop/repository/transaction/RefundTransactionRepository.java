package com.aims.repository;

import com.aims.entity.payment.RefundTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefundTransactionRepository extends MongoRepository<RefundTransaction, String> {
}
