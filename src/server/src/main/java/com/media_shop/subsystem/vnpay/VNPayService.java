package com.media_shop.subsystem.vnpay;

import com.google.gson.Gson;
import com.media_shop.entity.payment.PaymentTransaction;
import com.media_shop.entity.payment.RefundTransaction;
import com.media_shop.exception.pay.*;
import com.media_shop.subsystem.vnpay.pay.*;
import com.media_shop.subsystem.vnpay.refund.RefundRequest;
import com.media_shop.subsystem.vnpay.refund.RefundResponse;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class VNPayService {

    public VNPayService() {
    }

    public String generateUrl(String orderId) throws IOException {
        PayRequest payRequest = new PayRequest(orderId);
        return payRequest.generateURL();
    }

    public RefundTransaction refund(PaymentTransaction paymentTransaction) throws IOException {
        RefundRequest refundRequestVNPay = new RefundRequest(paymentTransaction);
        String response = refundRequestVNPay.refund();
        Gson gson = new Gson();
        Type type = new com.google.gson.reflect.TypeToken<HashMap<String, String>>() {}.getType();
        HashMap<String, String> resultHashmap = gson.fromJson(response, type);
        RefundResponse refundResponseVNPay = new RefundResponse(resultHashmap);
        return refundResponseVNPay.getRefundTransactionResponse();
    }

    public PaymentTransaction responseToPaymentTransaction(Map<String,String> response) {
        if (response == null) {
            return null;
        }
        switch (response.get("vnp_ResponseCode")) {
            case "00":
                break;
            case "01":
                throw new IncompletTransactionException();
            case "02":
                throw new FailedTransactionException();
            case "04":
                throw new ReversedTransactionException();
            case "05":
                throw new ProcessingTransactionException();
            case "09":
                throw new RefundRejectedTransactionException();
            case "06":
                throw new RefundRequestedTransactionException();
            case "07":
                throw new SuspiciousTransactionException();
            default:
                throw new RuntimeException();
        }
        String userId = response.get("userId");
        String transactionId = response.get("vnp_TransactionNo");
        String transactionContent = response.get("vnp_OrderInfo");
        long amount = Integer.parseInt(response.get("vnp_Amount")) / 100;
        String createdAt = response.get("vnp_PayDate");
        String vnpTxnRef = response.get("vnp_TxnRef");
        String vnpRecode = response.get("vnp_ResponseCode");
        String vnpBankCode = response.get("vnp_BankCode");
        String vnpTransactionStatus = response.get("vnp_TransactionStatus");
        PaymentTransaction trans = new PaymentTransaction(
            null,
            userId, 
            vnpTxnRef, 
            amount, 
            transactionContent, 
            vnpRecode, 
            transactionId,
            vnpBankCode, 
            createdAt, 
            vnpTransactionStatus);
        
        return trans;
    }


}
