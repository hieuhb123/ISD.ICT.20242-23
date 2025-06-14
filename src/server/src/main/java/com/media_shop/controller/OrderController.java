package com.media_shop.controller;

import com.media_shop.dto.OrderRequestDTO;
import com.media_shop.entity.order.Order;
import com.media_shop.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequestDTO orderRequestDTO, @RequestParam String userId) {
        Order order = orderService.placeOrder(orderRequestDTO);
        order.setUserId(userId);
        return ResponseEntity.ok(order);
    }
}
