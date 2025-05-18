package com.media_shop.repository;

import com.media_shop.entity.Order;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

// High cohesion - only deals with in-memory data access
// SRP respected - class serves as in-memory persistence layer

public class InMemoryOrderRepository implements OrderRepository {
    private final Map<String, Order> storage = new HashMap<>();

    @Override
    public Optional<Order> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public void save(Order order) {
        storage.put(order.getId(), order);
    }
}
