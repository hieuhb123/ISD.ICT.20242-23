package com.media_shop.strategy;

import com.media_shop.dto.CheckoutRequest;

import java.util.Map;

public interface PaymentStrategy {
    String generateUrl(CheckoutRequest request); // redirect

    void handleReturn(Map<String, String> response); // turn back

    String getType(); // type of paying: COD, VNPay...
}
