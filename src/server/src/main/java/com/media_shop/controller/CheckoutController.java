package com.media_shop.controller;

import com.media_shop.dto.CheckoutRequest;
import com.media_shop.service.implementation.CheckoutService;
import com.media_shop.repository.media_shopResponse;
import com.media_shop.subsystem.vnpay.VNPayService;
import com.media_shop.utils.Constants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin("*")
public class CheckoutController {

    private final CheckoutService checkoutService;
    private final VNPayService vnPayService;

    public CheckoutController(CheckoutService checkoutService, VNPayService vnPayService){
        this.checkoutService = checkoutService;
        this.vnPayService = vnPayService;
    }

    @PostMapping("/start")
    public ResponseEntity<media_shopResponse<String>> checkout(@RequestBody CheckoutRequest request) throws IOException {
        // get total
        int totalAmount = checkoutService.calculateTotal(request);

        // create payment link from VNPay
        String paymentUrl = vnPayService.generateUrl(totalAmount, request.getOrderId());

        // return response for frontend
        media_shopResponse<String> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Checkout Successful", paymentUrl);
        return ResponseEntity.ok(response);
    }
}
