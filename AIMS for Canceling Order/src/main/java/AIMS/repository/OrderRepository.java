package AIMS.repository;

import AIMS.entity.Order;
import java.util.Optional;

public interface OrderRepository {
    Optional<Order> findById(String id);
    void save(Order order);
}
