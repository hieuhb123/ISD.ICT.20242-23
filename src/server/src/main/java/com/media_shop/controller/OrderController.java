package com.media_shop.controller;

import com.media_shop.entity.order.Order;
import com.media_shop.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(@RequestBody Order orderRequest, @RequestParam String cartId) {
        Order order = orderService.placeOrder(orderRequest, cartId);
        return ResponseEntity.ok(order);
    }
}
