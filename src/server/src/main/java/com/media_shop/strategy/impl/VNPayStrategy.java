package com.media_shop.strategy.impl;

import com.media_shop.dto.CheckoutRequest;
import com.media_shop.entity.payment.PaymentTransaction;
import com.media_shop.repository.order.OrderRepository;
import com.media_shop.repository.transaction.PaymentTransactionRepository;
import com.media_shop.strategy.PaymentStrategy;
import com.media_shop.subsystem.vnpay.pay.PayRequest;
import com.media_shop.subsystem.vnpay.VNPayService;
import org.springframework.stereotype.Component;

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
    public void handleReturn(Map<String, String> response){
        vnPayService.responseToPaymentTransaction(response);
    }

    @Override
    public String getType(){
        return "vnpay";
    }

}
