package com.media_shop.service.implementation;

import com.media_shop.entity.cart.*;
import com.media_shop.entity.order.*;
import com.media_shop.entity.product.Product;
import com.media_shop.repository.cart.CartRepository;
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
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Order placeOrder(Order order, String cartId) {
        List<OrderItem> orderItems = new ArrayList<>();
        double total = 0;
        for (OrderItem item : order.getItems()) {
            Optional<Product> productOpt = productRepository.findById(item.getProductId());
            if (productOpt.isEmpty()) {
                throw new RuntimeException("Product not found: " + item.getProductId());
            }
            Product product = productOpt.get();
            if (product.getQuantity() < item.getQuantity()) {
                throw new RuntimeException("Not enough stock for product: " + item.getProductId());
            }
            // Trừ số lượng sản phẩm
            product.setQuantity(product.getQuantity() - item.getQuantity());
            productRepository.save(product);

            double price = product.getPrice() * item.getQuantity();
            total += price;
            orderItems.add(new OrderItem(item.getProductId(), product.getTitle(), product.getImageURL(),item.getQuantity(), product.getPrice()));
        }
        order.setCancellable(true);
        order.setStatus(Constants.ORDER_STATUS_PENDING);
        order.setItems(orderItems);
        order.setTotal(total);
        Order savedOrder = orderRepository.save(order);

        if (cartId != null && !cartId.isEmpty()) {
            Optional<Cart> cartOpt = cartRepository.findById(cartId);
            if (cartOpt.isPresent()) {
                Cart cart = cartOpt.get();
                List<CartItem> updatedCartItems = new ArrayList<>(cart.getListCartItem());
                for (OrderItem orderedItem : orderItems) {
                    updatedCartItems.removeIf(cartItem -> cartItem.getProductId().equals(orderedItem.getProductId()));
                }
                cart.setListCartItem(updatedCartItems);
                cartRepository.save(cart);
            }
        }

        return savedOrder;
    }

    @Override
    public Order getOrderById(String orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
    }
    @Override
    public List<Order> getAllOrdersByUserId(String userId) {
        return orderRepository.findAll()
        .stream()
        .filter(order -> order.getUserId() != null && order.getUserId().equals(userId))
        .toList();
    }
}
