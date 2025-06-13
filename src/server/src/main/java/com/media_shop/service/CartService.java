package com.media_shop.service;

import com.media_shop.dto.CartProductDTO;
import com.media_shop.entity.cart.Cart;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CartService {
    Cart createCart();
    Cart getCart(String cartId);
    Cart addItem(String cartId, String productID, int quantity);
    Cart removeItem(String cartId, String productID);
    Cart clearCart(String cartId);
    double getTotalPrice(String cartId);
    List<CartProductDTO> getAllCartItems(String cartId);
}
