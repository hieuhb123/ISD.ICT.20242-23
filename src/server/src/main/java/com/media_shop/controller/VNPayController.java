package com.media_shop.controller;

import com.media_shop.entity.payment.PaymentTransaction;
import com.media_shop.entity.payment.RefundTransaction;
import com.media_shop.repository.media_shopResponse;
import com.media_shop.repository.transaction.PaymentTransactionRepository;
import com.media_shop.repository.transaction.RefundTransactionRepository;
import com.media_shop.subsystem.vnpay.VNPayService;
import com.media_shop.utils.Constants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/payment")
public class VNPayController {

    private final VNPayService vnpayService;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final RefundTransactionRepository refundTransactionRepository;

    public VNPayController(VNPayService vnpayService, PaymentTransactionRepository paymentTransactionRepository, RefundTransactionRepository refundTransactionRepository) {
        this.vnpayService = vnpayService;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.refundTransactionRepository = refundTransactionRepository;
    }

    @GetMapping("/pay")
    public ResponseEntity<media_shopResponse<String>> generateUrl(@RequestParam int amount, @RequestParam String orderId) throws IOException {
        String result = vnpayService.generateUrl(amount, orderId);
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

    @PostMapping("/save-payment-transaction")
    public ResponseEntity<media_shopResponse<PaymentTransaction>> saveTransaction(@RequestBody Map<String, String> response) {
        PaymentTransaction paymentTransaction = vnpayService.savePaymentTransaction(response);
        paymentTransactionRepository.save(paymentTransaction);
        media_shopResponse<PaymentTransaction> res = new media_shopResponse<>(Constants.SUCCESS_CODE, "Save payment transaction successfully", paymentTransaction);
        return ResponseEntity.ok(res);
    }

}
