package com.media_shop.service;

import com.media_shop.entity.Order;
import com.media_shop.exception.OrderCannotBeCancelledException;
import com.media_shop.exception.OrderNotFoundException;
import com.media_shop.repository.InMemoryOrderRepository;
import com.media_shop.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class OrderServiceTest {
    private InMemoryOrderRepository repository;
    private OrderService service;

    @BeforeEach
    public void setup() {
        repository = new InMemoryOrderRepository();
        service = new OrderService(repository);
    }

    @Test
    public void testCancelOrderSuccess() {
        Order order = new Order("123", true);
        repository.save(order);

        service.cancelOrder("123");

        assertTrue(repository.findById("123").get().isCancelled());
    }

    @Test
    public void testCancelNonExistentOrder() {
        assertThrows(OrderNotFoundException.class, () -> {
            service.cancelOrder("999");
        });
    }

    @Test
    public void testCancelUncancellableOrder() {
        Order order = new Order("321", false);
        repository.save(order);

        assertThrows(OrderCannotBeCancelledException.class, () -> {
            service.cancelOrder("321");
        });
    }

    @Test
    public void testCancelAlreadyCancelledOrder() {
        Order order = new Order("555", true);
        order.cancel(); // manually cancel
        repository.save(order);

        assertThrows(OrderCannotBeCancelledException.class, () -> {
            service.cancelOrder("555");
        });
    }
}
