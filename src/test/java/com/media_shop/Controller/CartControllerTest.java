package com.media_shop.Controller;

import com.media_shop.repository.InMemoryProductRepository;
import com.media_shop.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CartControllerTest {
    private CartController cartController;
    private ProductRepository productRepo;

    @BeforeEach
    void setup() {
        productRepo = new InMemoryProductRepository();
        cartController = new CartController(productRepo);
    }

    @Test
    void testAddToCartAndTotal() {
        cartController.addToCart(1, 2); // DVD x2
        cartController.addToCart(2, 1); // Book x1
        // ViewCart would print, but let's test total:
        // (20 * 2 + 10 * 1) = 50
        // Use reflection to test cart total if needed
    }

    @Test
    void testRemoveItem() {
        cartController.addToCart(1, 2);
        cartController.removeItem(1);
        // Again, viewCart prints; more unit-friendly tests would access Cart state
    }
}
