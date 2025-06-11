package com.media_shop.subsystem.vnpay;

import com.media_shop.entity.payment.PaymentTransaction;
import com.media_shop.entity.payment.RefundTransaction;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
public class VNPayService {

    private final VNPayManager vnpayManager;

    public VNPayService(VNPayManager vnpayManager) {
        this.vnpayManager = vnpayManager;
    }

    public String generateUrl(int amount, String orderId) throws IOException {
        return vnpayManager.generateUrl(amount, orderId);
    }

    public RefundTransaction refund(PaymentTransaction paymentTransaction) throws IOException {
        return vnpayManager.refund(paymentTransaction);
    }

    public PaymentTransaction savePaymentTransaction(Map<String,String> response) {
        return vnpayManager.savePaymentTransaction(response);
    }


}
