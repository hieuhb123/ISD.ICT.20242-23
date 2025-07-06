package com.media_shop.controller;

import com.media_shop.dto.CheckoutRequest;
import com.media_shop.entity.payment.PaymentTransaction;
import com.media_shop.entity.payment.RefundTransaction;
import com.media_shop.repository.media_shopResponse;
import com.media_shop.repository.transaction.PaymentTransactionRepository;
import com.media_shop.repository.transaction.RefundTransactionRepository;
import com.media_shop.repository.order.OrderRepository;
import com.media_shop.strategy.PaymentStrategy;
import com.media_shop.strategy.PaymentStrategyFactory;
import com.media_shop.subsystem.vnpay.VNPayService;
import com.media_shop.utils.Constants;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentStrategyFactory strategyFactory;
    private final RefundTransactionRepository refundTransactionRepository;
    private final VNPayService vnpayService;

    public PaymentController(PaymentStrategyFactory strategyFactory, RefundTransactionRepository refundTransactionRepository, VNPayService vnpayService){
        this.strategyFactory = strategyFactory;
        this.refundTransactionRepository = refundTransactionRepository;
        this.vnpayService = vnpayService;
    }


    @GetMapping("/pay")
    public ResponseEntity<?> generateUrl(@RequestParam String orderId,
                                         @RequestParam String type){
        try{
            CheckoutRequest request = new CheckoutRequest();
            request.setOrderId(orderId);
            String url = strategyFactory.getStrategy(type).generateUrl(request);

            return ResponseEntity.ok(new media_shopResponse<>(200, "Success", url));
        } catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().body(
                new media_shopResponse<>(Constants.FAILURE_CODE, "Unsupported payment type: " + type, null));
        } catch (Exception e){
            return ResponseEntity.internalServerError().body(
                    new media_shopResponse<>(Constants.FAILURE_CODE, "Failed to generate payment URL", null));
        }
    }

    @PostMapping("/pay_return")
    public ResponseEntity<?> handleReturn(@RequestParam String type,
                                          @RequestBody Map<String, String> payload){
        try {
            strategyFactory.getStrategy(type.toLowerCase()).handleReturn(payload);
            return ResponseEntity.ok(new media_shopResponse<>(Constants.SUCCESS_CODE, "Handled return successfully", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    new media_shopResponse<>(Constants.FAILURE_CODE, "Unsupported payment type: " + type, null));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    new media_shopResponse<>(Constants.ERROR_CODE, "Failed to handle payment return", null));
        }
    }

    @GetMapping("/transaction/{orderId}")
    public ResponseEntity<?> getTransactionByOrderId(@PathVariable String orderId) {
        try {
            PaymentTransaction transaction = vnpayService.getTransactionByOrderId(orderId);
            return ResponseEntity.ok(new media_shopResponse<>(Constants.SUCCESS_CODE, "Transaction found", transaction));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(new media_shopResponse<>(Constants.ERROR_CODE, "Transaction not found: " + e.getMessage(), null));
        }
    }



    @PostMapping("/refund")
    public ResponseEntity<media_shopResponse<RefundTransaction>> refund(@RequestBody PaymentTransaction paymentTransaction) {
        try {
            RefundTransaction refundTransaction = vnpayService.refund(paymentTransaction);
            refundTransactionRepository.save(refundTransaction);
            media_shopResponse<RefundTransaction> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Refund successfully", refundTransaction);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            media_shopResponse<RefundTransaction> response = new media_shopResponse<>(Constants.ERROR_CODE, "Refund failed: " + e.getMessage(), null);
            return ResponseEntity.status(500).body(response);
        }
    }



}
