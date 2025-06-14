package com.media_shop.service.implementation;

import com.media_shop.dto.OrderRequestDTO;
import com.media_shop.entity.order.*;
import com.media_shop.entity.product.Product;
import com.media_shop.repository.order.OrderRepository;
import com.media_shop.repository.product.ProductRepository;
import com.media_shop.service.OrderService;
import com.media_shop.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Order placeOrder(OrderRequestDTO orderRequestDTO) {
        List<OrderItem> orderItems = new ArrayList<>();
        int total = 0;
        for (OrderRequestDTO.OrderItemDTO itemDTO : orderRequestDTO.getItems()) {
            Optional<Product> productOpt = productRepository.findById(itemDTO.getProductId());
            if (productOpt.isEmpty()) {
                throw new RuntimeException("Product not found: " + itemDTO.getProductId());
            }
            Product product = productOpt.get();
            double price = product.getPrice() * itemDTO.getQuantity();
            total += price;
            orderItems.add(new OrderItem(itemDTO.getProductId(), itemDTO.getQuantity(), product.getPrice()));
        }
        Order order = new Order();
        order.setUserId(orderRequestDTO.getUserId());
        order.setShippingAddress(orderRequestDTO.getShippingAddress());
        order.setCancellable(true);
        order.setStatus(Constants.ORDER_STATUS_PENDING);
        order.setItems(orderItems);
        order.setTotal(total);
        return orderRepository.save(order);
    }
}
