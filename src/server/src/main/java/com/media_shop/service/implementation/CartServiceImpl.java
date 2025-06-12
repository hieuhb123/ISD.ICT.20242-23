package com.media_shop.service.implementation;

import com.media_shop.entity.cart.Cart;
import com.media_shop.entity.cart.CartItem;
import com.media_shop.entity.product.Product;
import com.media_shop.repository.cart.CartRepository;
import com.media_shop.service.CartService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;

    public CartServiceImpl(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    @Override
    public Cart createCart() {
        return cartRepository.save(new Cart());
    }

    @Override
    public Cart getCart(String cartId) {
        // Ensure the cart is properly initialized
        return cartRepository.findById(cartId).orElse(new Cart(cartId, new ArrayList<>(), 0));
    }

    @Override
    public Cart addItem(String cartId, Product product, int quantity) {
        Cart cart = getCart(cartId);

        if (cart.getListCartItem() == null) {
            cart.setListCartItem(new ArrayList<>());
        }

        Optional<CartItem> existingItem = cart.getListCartItem().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
        } else {
            cart.getListCartItem().add(new CartItem(product, quantity));
        }

        cart.setTotalPrice(cart.getListCartItem().stream()
                .mapToInt(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum());
        return cartRepository.save(cart);
    }

    @Override
    public Cart removeItem(String cartId, Product product) {
        Cart cart = getCart(cartId);
        if (cart.getListCartItem() != null) {
            cart.getListCartItem().removeIf(item ->
                    item.getProduct() != null && product.getId().equals(item.getProduct().getId()));
        }

        cart.setTotalPrice(cart.getListCartItem().stream()
                .mapToInt(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum());
        return cartRepository.save(cart);
    }

    @Override
    public Cart clearCart(String cartId) {
        Cart cart = getCart(cartId);
        cart.getListCartItem().clear();
        cart.setTotalPrice(0);
        return cartRepository.save(cart);
    }

    @Override
    public List<CartItem> getAllCartItems(String cartId) {
        Cart cart = getCart(cartId);
        return cart.getListCartItem();
    }
    @Override
    public int getTotalPrice(String cartId) {
        Cart cart = getCart(cartId);
        return cart.getTotalPrice();
    }
}
