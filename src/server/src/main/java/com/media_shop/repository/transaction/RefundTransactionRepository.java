package com.media_shop.repository.transaction;

import com.media_shop.entity.payment.RefundTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefundTransactionRepository extends MongoRepository<RefundTransaction, String> {
}
