package com.media_shop.strategy;

import com.media_shop.dto.CheckoutRequest;
import com.media_shop.entity.payment.PaymentTransaction;
import com.media_shop.entity.payment.RefundTransaction;

import java.io.IOException;
import java.util.Map;

public interface PaymentStrategy {
    String generateUrl(CheckoutRequest request); // redirect

    void handleReturn(Map<String, String> response); // turn back
    RefundTransaction refund(PaymentTransaction paymentTransaction) throws IOException;
    String getType(); // type of paying: COD, VNPay...
}
