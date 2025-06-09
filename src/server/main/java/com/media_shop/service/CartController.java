package com.media_shop.service;

import com.media_shop.entity.*;
import com.media_shop.repository.ProductRepository;

public class CartController {
    private final Cart cart;
    private final ProductRepository productRepo;

    public CartController(ProductRepository productRepo) {
        this.cart = new Cart();
        this.productRepo = productRepo;
    }

    public void addToCart(int productId, int quantity) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found."));
        cart.addItem(product, quantity);
    }

    public void updateItem(int productId, int quantity) {
        cart.updateQuantity(productId, quantity);
    }

    public void removeItem(int productId) {
        cart.removeItem(productId);
    }

    public void viewCart() {
        for (CartItem item : cart.getItems()) {
            System.out.printf("Product: %s, Quantity: %d, Subtotal: %.2f%n",
                    item.getProduct().getName(),
                    item.getQuantity(),
                    item.getTotalPrice()
            );
        }
        System.out.printf("Total: %.2f%n", cart.getTotalPrice());
    }
}

