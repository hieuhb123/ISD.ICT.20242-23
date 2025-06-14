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

@RestController
@CrossOrigin("*")
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
    public ResponseEntity<media_shopResponse<String>> generateUrl(@RequestParam int amount, @RequestParam String orderId) throws IOException {
        String result = vnpayService.generateUrl(amount, orderId);
        media_shopResponse<String> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Success", result);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/pay_return")
    public String payReturn(HttpServletRequest request, Model model) {
        // Get parameters from VNPay return URL
        String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
        String orderId = request.getParameter("vnp_TxnRef"); 
        String amount = request.getParameter("vnp_Amount");
        String vnp_TransactionNo = request.getParameter("vnp_TransactionNo");
        String vnp_TransactionStatus = request.getParameter("vnp_TransactionStatus");
        String vnp_BankCode = request.getParameter("vnp_BankCode");
        String vnp_PayDate = request.getParameter("vnp_PayDate");
        String vnp_OrderInfo = request.getParameter("vnp_OrderInfo");

        try {
            Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
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

            if ("00".equals(vnp_ResponseCode)) {
                model.addAttribute("status", "success");
                model.addAttribute("message", "Thanh toán thành công!");
                model.addAttribute("orderId", orderId);
                model.addAttribute("amount", Long.parseLong(amount)/100); // Convert from VNĐ
                return "payment-success"; // Return success view template
            } else {
                model.addAttribute("status", "failed");
                model.addAttribute("message", "Thanh toán thất bại!");
                model.addAttribute("orderId", orderId);
                return "payment-failed"; // Return failed view template
            }

        } catch (Exception e) {
            model.addAttribute("status", "error");
            model.addAttribute("message", "Có lỗi xảy ra: " + e.getMessage());
            return "payment-error"; // Return error view template
        }
    }

    @GetMapping("/refund")
    public ResponseEntity<media_shopResponse<RefundTransaction>> refund(@RequestBody PaymentTransaction paymentTransaction) throws IOException {
            RefundTransaction refundTransaction = vnpayService.refund(paymentTransaction);
            refundTransactionRepository.save(refundTransaction);
            media_shopResponse<RefundTransaction> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Refund successfully", refundTransaction);
            return ResponseEntity.ok(response);
    }
    

}
