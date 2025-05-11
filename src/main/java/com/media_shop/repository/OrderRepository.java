package com.media_shop.repository;

import com.media_shop.entity.Order;
import java.util.Optional;

public interface OrderRepository {
    Optional<Order> findById(String id);
    void save(Order order);
}
