package com.media_shop.service.implementation;

import com.media_shop.dto.CartItemDTO;
import com.media_shop.dto.CheckoutRequest;
import com.media_shop.entity.product.Product;
import com.media_shop.repository.product.ProductRepository;
import org.springframework.stereotype.Service;

@Service
public class CheckoutService {

    private final ProductRepository productRepository;

    public CheckoutService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public int calculateTotal(CheckoutRequest request){
        double subtotal = 0;
        double rushFee = 0;
        double maxWeight = 0;

        for(CartItemDTO item : request.getCartItems()){
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product Not Found: " + item.getProductId()));

            double itemTotal = product.getPrice() * item.getQuantity();
            subtotal += itemTotal;

            if(product.getWeight() > maxWeight){
                maxWeight = product.getWeight();
            }

            if(request.isRushOrder()){
                rushFee += 10000 * item.getQuantity(); // 10k moi san pham
            }
        }

        // 10% value-added tax (VAT)
        double vat = subtotal * 0.1;
        double subtotalWithVat = subtotal + rushFee + vat;

        double shippingFee = calculateShippingFee(maxWeight, request.getProvince(), subtotal, request.isRushOrder());

        double finalTotal = subtotalWithVat + shippingFee + rushFee;

        return (int) Math.round(finalTotal);
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
