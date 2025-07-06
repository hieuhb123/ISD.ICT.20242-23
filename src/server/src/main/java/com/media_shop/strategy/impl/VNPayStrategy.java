package com.media_shop.strategy.impl;

import com.media_shop.dto.CheckoutRequest;
import com.media_shop.entity.order.Order;
import com.media_shop.entity.payment.PaymentTransaction;
import com.media_shop.entity.payment.RefundTransaction;
import com.media_shop.repository.order.OrderRepository;
import com.media_shop.repository.transaction.PaymentTransactionRepository;
import com.media_shop.strategy.PaymentStrategy;
import com.media_shop.subsystem.vnpay.pay.PayRequest;
import com.media_shop.subsystem.vnpay.VNPayService;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Map;

@Component
public class VNPayStrategy implements PaymentStrategy{


    private final OrderRepository orderRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final VNPayService vnPayService;

    public VNPayStrategy(OrderRepository orderRepository,
                         PaymentTransactionRepository paymentTransactionRepository,
                         VNPayService vnPayService){
        this.orderRepository = orderRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.vnPayService = vnPayService;
    }

    @Override
    public String generateUrl(CheckoutRequest request){
        try{
            PayRequest payRequest = new PayRequest(orderRepository, request.getOrderId());
            return payRequest.generateURL();
        } catch (UnsupportedEncodingException e){
            throw new RuntimeException(e);
        }
    }

    @Override
    public RefundTransaction refund(PaymentTransaction paymentTransaction){
        try{
            return vnPayService.refund(paymentTransaction);
        } catch(IOException e){
            throw new RuntimeException(e);
        }
    }

    @Override
    public void handleReturn(Map<String, String> response){
        String responseCode = response.get("vnp_ResponseCode");
        String orderId = response.get("vnp_TxnRef");

        System.out.println("Received response with orderId = " + orderId + " and responseCode = " + responseCode);

        vnPayService.responseToPaymentTransaction(response);

        if ("00".equals(responseCode)) {
            orderRepository.findById(orderId).ifPresent(order -> {
                order.setStatus("PAID");
                Order saved = orderRepository.save(order);
                System.out.println("Order updated successfully: " + saved);
            });
        } else {
            System.out.println("Payment failed or was not successful.");
        }
    }




    @Override
    public String getType(){
        return "vnpay";
    }

}
