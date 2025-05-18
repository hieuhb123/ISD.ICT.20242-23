package com.media_shop.service;

import com.media_shop.entity.Order;
import com.media_shop.exception.OrderCannotBeCancelledException;
import com.media_shop.exception.OrderNotFoundException;
import com.media_shop.repository.OrderRepository;

// High cohesion - only order-relate to business logic
// Does not violate SRP - class focuses on cancelOrder logic

public class OrderService {
    private final OrderRepository repository;

    public OrderService(OrderRepository repository) {
        this.repository = repository;
    }

    public void cancelOrder(String orderId) {
        Order order = repository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        if (!order.isCancellable() || order.isCancelled()) {
            throw new OrderCannotBeCancelledException(orderId);
        }

        order.cancel();
        repository.save(order);
    }
}
