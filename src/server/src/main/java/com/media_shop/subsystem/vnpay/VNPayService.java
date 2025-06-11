package com.media_shop.subsystem.vnpay;

import com.google.gson.Gson;
import com.media_shop.entity.payment.PaymentTransaction;
import com.media_shop.entity.payment.RefundTransaction;
import com.media_shop.subsystem.vnpay.pay.*;
import com.media_shop.subsystem.vnpay.refund.RefundRequest;
import com.media_shop.subsystem.vnpay.refund.RefundResponse;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;

@Service
public class VNPayService {

    public VNPayService() {
    }

    public String generateUrl(int amount, String orderId) throws IOException {
        PayRequest payRequest = new PayRequest(amount, orderId);
        return payRequest.generateURL();
    }

    public RefundTransaction refund(PaymentTransaction paymentTransaction) throws IOException {
        RefundRequest refundRequestVNPay = new RefundRequest( paymentTransaction);
        String response = refundRequestVNPay.refund();
        Gson gson = new Gson();
        Type type = new com.google.gson.reflect.TypeToken<HashMap<String, String>>() {}.getType();
        HashMap<String, String> resultHashmap = gson.fromJson(response, type);
        RefundResponse refundResponseVNPay = new RefundResponse(resultHashmap);
        return refundResponseVNPay.getRefundTransactionResponse();
    }

    public PaymentTransaction savePaymentTransaction(Map<String,String> response) {
        return new PayResponse(response).savePaymentTransaction();
    }


}
