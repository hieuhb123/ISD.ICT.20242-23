package com.media_shop.subsystem.vnpay;

import com.google.gson.Gson;
import com.media_shop.entity.order.Order;
import com.media_shop.entity.payment.PaymentTransaction;
import com.media_shop.entity.payment.RefundTransaction;
import com.media_shop.exception.pay.*;
import com.media_shop.repository.order.OrderRepository;
import com.media_shop.repository.transaction.PaymentTransactionRepository;
import com.media_shop.subsystem.vnpay.pay.*;
import com.media_shop.subsystem.vnpay.refund.RefundRequest;
import com.media_shop.subsystem.vnpay.refund.RefundResponse;
import com.media_shop.utils.Constants;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;

@Service
public class VNPayService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    public VNPayService() {
    }



    public String generateUrl(String orderId) throws IOException {
        PayRequest payRequest = new PayRequest(orderRepository, orderId);
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
        // Get parameters from VNPay return URL
        String vnp_ResponseCode = response.get("vnp_ResponseCode");
        String orderId = response.get("vnp_TxnRef"); 
        String amount = response.get("vnp_Amount");
        String vnp_TransactionNo = response.get("vnp_TransactionNo");
        String vnp_TransactionStatus = response.get("vnp_TransactionStatus");
        String vnp_BankCode = response.get("vnp_BankCode");
        String vnp_PayDate = response.get("vnp_PayDate");
        String vnp_OrderInfo = response.get("vnp_OrderInfo");

        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        if ("00".equals(vnp_ResponseCode)) {
            order.setStatus(Constants.ORDER_STATUS_PAID);
            orderRepository.save(order);
        }
        String userId = order.getUserId();
        PaymentTransaction trans = new PaymentTransaction(
            null,                         
            userId,          
            orderId,              
            Long.parseLong(amount),
            vnp_OrderInfo,         
            vnp_ResponseCode,      
            vnp_TransactionNo,     
            vnp_BankCode,          
            vnp_PayDate,           
            vnp_TransactionStatus  
        );
        
        paymentTransactionRepository.save(trans);

        return trans;

    }

}
