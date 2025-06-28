package com.media_shop.repository.transaction;

import com.media_shop.entity.payment.PaymentTransaction;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentTransactionRepository extends MongoRepository<PaymentTransaction, String> {
    Optional<PaymentTransaction> findByOrderId(String orderId);
}
