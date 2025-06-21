package com.media_shop.service;

import java.util.List;

import com.media_shop.entity.order.Order;

public interface OrderService {
    Order placeOrder(Order orderRequest, String cartId);
    Order getOrderById(String orderId);
    List<Order> getAllOrdersByUserId(String userId);
}
