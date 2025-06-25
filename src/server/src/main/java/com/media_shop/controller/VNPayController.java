package com.media_shop.controller;

import com.media_shop.entity.order.Order;
import com.media_shop.entity.payment.PaymentTransaction;
import com.media_shop.entity.payment.RefundTransaction;
import com.media_shop.repository.media_shopResponse;
import com.media_shop.repository.transaction.PaymentTransactionRepository;
import com.media_shop.repository.transaction.RefundTransactionRepository;
import com.media_shop.repository.order.OrderRepository;
import com.media_shop.subsystem.vnpay.VNPayService;
import com.media_shop.utils.Constants;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class VNPayController {

    private final VNPayService vnpayService;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final RefundTransactionRepository refundTransactionRepository;
    private final OrderRepository orderRepository;

    public VNPayController(
        VNPayService vnpayService, 
        PaymentTransactionRepository paymentTransactionRepository, 
        RefundTransactionRepository refundTransactionRepository,
        OrderRepository orderRepository) {
        this.vnpayService = vnpayService;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.refundTransactionRepository = refundTransactionRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping("/pay")
    public ResponseEntity<media_shopResponse<String>> generateUrl(@RequestParam String orderId) throws IOException {
        String result = vnpayService.generateUrl(orderId);
        media_shopResponse<String> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Success", result);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/refund")
    public ResponseEntity<media_shopResponse<RefundTransaction>> refund(@RequestBody PaymentTransaction paymentTransaction) throws IOException {
            RefundTransaction refundTransaction = vnpayService.refund(paymentTransaction);
            refundTransactionRepository.save(refundTransaction);
            media_shopResponse<RefundTransaction> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Refund successfully", refundTransaction);
            return ResponseEntity.ok(response);
    }
    


    @PostMapping("/pay_return")
    public ResponseEntity<media_shopResponse<PaymentTransaction>> payReturn(@RequestBody Map<String, String> request) {
        PaymentTransaction paymentTransaction = vnpayService.responseToPaymentTransaction(request);
        media_shopResponse<PaymentTransaction> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Refund successfully", paymentTransaction);
        return ResponseEntity.ok(response);
    }
}
