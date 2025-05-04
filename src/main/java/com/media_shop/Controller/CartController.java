package com.media_shop.Controller;

import java.util.List;

public class CartController {
    private final CartRepository cartRepo;
    private final ProductRepository productRepo;

    public CartController(CartRepository cartRepo, ProductRepository productRepo) {
        this.cartRepo = cartRepo;
        this.productRepo = productRepo;
    }

    public void addItem(int customerId, int productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        Product product = productRepo.findById(productId);
        Cart cart = cartRepo.findByCustomerId(customerId);

        CartItem existingItem = cart.getItemByProduct(productId);
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            cart.addItem(new CartItem(product, quantity));
        }

        cartRepo.save(cart);
    }


    public List<CartItem> viewCart(int customerId) {
        return cartRepo.findByCustomerId(customerId).getItems();
    }
}
