package com.media_shop.service;

import com.media_shop.entity.cart.Cart;
import com.media_shop.entity.cart.CartItem;
import com.media_shop.entity.product.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CartService {
    Cart createCart();
    Cart getCart(String cartId);
    Cart addItem(String cartId, Product product, int quantity);
    Cart removeItem(String cartId, Product product);
    Cart clearCart(String cartId);
    List<CartItem> getAllCartItems(String cartId);
    double getTotalPrice(String cartId);
}
