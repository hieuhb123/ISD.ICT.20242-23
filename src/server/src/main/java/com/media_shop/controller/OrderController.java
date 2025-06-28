package com.media_shop.controller;

import com.media_shop.entity.order.Order;
import com.media_shop.entity.product.Product;
import com.media_shop.repository.media_shopResponse;
import com.media_shop.service.OrderService;
import com.media_shop.utils.Constants;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(@RequestBody Order orderRequest, @RequestParam String cartId) {
        Order order = orderService.placeOrder(orderRequest, cartId);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable String orderId) {
        Order order = orderService.getOrderById(orderId);
        if (order != null) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<media_shopResponse<List<Order>>> getOrdersByUserId(@PathVariable String userId) {
        List<Order> orders = orderService.getAllOrdersByUserId(userId);
        media_shopResponse<List<Order>> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Get all products successfully", orders);
        return ResponseEntity.ok(response);
    }

}
