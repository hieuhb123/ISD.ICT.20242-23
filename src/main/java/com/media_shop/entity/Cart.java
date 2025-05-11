package com.media_shop.entity;

import java.util.*;

public class Cart {
    private final Map<Integer, CartItem> items = new HashMap<>();

    public void addItem(Product product, int quantity) {
        if (items.containsKey(product.getId())) {
            CartItem item = items.get(product.getId());
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            items.put(product.getId(), new CartItem(product, quantity));
        }
    }

    public void updateQuantity(int productId, int newQuantity) {
        CartItem item = items.get(productId);
        if (item != null) {
            item.setQuantity(newQuantity);
        } else {
            throw new NoSuchElementException("Product not found in cart.");
        }
    }

    public void removeItem(int productId) {
        items.remove(productId);
    }

    public List<CartItem> getItems() {
        return new ArrayList<>(items.values());
    }

    public double getTotalPrice() {
        return items.values().stream().mapToDouble(CartItem::getTotalPrice).sum();
    }

    public boolean isEmpty() {
        return items.isEmpty();
    }
}
