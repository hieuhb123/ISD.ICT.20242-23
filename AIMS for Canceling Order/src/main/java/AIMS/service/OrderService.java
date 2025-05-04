package AIMS.service;

import AIMS.entity.Order;
import AIMS.exception.OrderCannotBeCancelledException;
import AIMS.exception.OrderNotFoundException;
import AIMS.repository.OrderRepository;

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
