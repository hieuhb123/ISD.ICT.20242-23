package com.media_shop.service;

import com.media_shop.dto.CartItemDTO;
import com.media_shop.entity.cart.Cart;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CartService {
    Cart createCart();
    Cart addItem(String cartId, String productID, int quantity);
    Cart removeItem(String cartId, String productID);
    Cart clearCart(String cartId);
    double getTotalPrice(String cartId);
    List<CartItemDTO> getAllCartItems(String cartId);
}
