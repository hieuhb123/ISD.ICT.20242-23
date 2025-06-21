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
        double subtotal = 0;
        double rushFee = 0;
        double maxWeight = 0;
        List<OrderItem> orderItems = new ArrayList<>();


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

            if(product.getWeight() > maxWeight){
                maxWeight = product.getWeight();
            }

            if(order.getIsRushOrder()){
                rushFee += 10000 * item.getQuantity(); // 10k moi san pham
            }

            double price = product.getPrice() * item.getQuantity();
            subtotal += price;

            orderItems.add(new OrderItem(item.getProductId(), product.getTitle(), product.getImageURL(),item.getQuantity(), product.getPrice()));
        }

        // 10% value-added tax (VAT)
        double vat = subtotal * 0.1;
        double subtotalWithVat = subtotal + rushFee + vat;

        double shippingFee = calculateShippingFee(maxWeight, order.getProvince(), subtotal, order.getIsRushOrder());

        double finalTotal = subtotalWithVat + shippingFee + rushFee;

        order.setCancellable(true);
        order.setStatus(Constants.ORDER_STATUS_PENDING);
        order.setItems(orderItems);
        order.setShippingFee(shippingFee);
        order.setVat(vat);
        order.setTotal(finalTotal);
        
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


    private double calculateShippingFee(double maxWeight, String province, double subtotal, boolean isRushOrder){
        if(isRushOrder){
            return calculateBaseShipping(maxWeight, province);
        }

        if(subtotal > 100_000){
            return Math.min(25_000, calculateBaseShipping(maxWeight, province));
        }

        return calculateBaseShipping(maxWeight, province);
    }

    private double calculateBaseShipping(double weight, String province){
        boolean isInnerCity = province.equalsIgnoreCase("Hanoi") || province.equalsIgnoreCase("Ho Chi Minh");

        double base = isInnerCity ? 22_000 : 30_000;
        double threshold = isInnerCity ? 3.0 : 0.5;

        if(weight <= threshold) return base;

        double extraWeight = weight - threshold;
        int extraSegments = (int) Math.ceil(extraWeight / 0.5);

        return base + extraSegments * 2500;

    }
}
