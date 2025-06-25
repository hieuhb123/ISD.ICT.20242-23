package com.media_shop.controller;

import com.media_shop.dto.CartItemDTO;
import com.media_shop.entity.cart.Cart;
import com.media_shop.repository.media_shopResponse;
import com.media_shop.service.CartService;
import com.media_shop.utils.Constants;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{cartId}")
    public ResponseEntity<media_shopResponse<List<CartItemDTO>>> getCart(@PathVariable String cartId) {
        List<CartItemDTO> cart = cartService.getAllCartItems(cartId);
        media_shopResponse<List<CartItemDTO>> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Get cart successfully", cart);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/new")
    public ResponseEntity<media_shopResponse<Cart>> createCart() {
        Cart cart = cartService.createCart();
        media_shopResponse<Cart> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Create new cart successfully", cart);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{cartId}/add")
    public ResponseEntity<media_shopResponse<Cart>> addCartProduct(@PathVariable String cartId, @RequestParam String productId, @RequestParam int quantity) {
        Cart cart = cartService.addItem(cartId, productId, quantity);
        media_shopResponse<Cart> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Add product to cart successfully", cart);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/remove")
    public ResponseEntity<media_shopResponse<Cart>> removeCartProduct(@RequestParam String cartId, @RequestParam String productId) {
        Cart cart =  cartService.removeItem(cartId, productId);
        media_shopResponse<Cart> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Remove product from cart successfully", cart);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/clear")
    public ResponseEntity<media_shopResponse<Cart>> clearCart(@RequestParam String cartId) {
        Cart cart = cartService.clearCart(cartId);
        media_shopResponse<Cart> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Clear cart successfully", cart);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{cartId}/items/{productId}")
    public ResponseEntity<media_shopResponse<Cart>> updateItemQuantity(
            @PathVariable String cartId,
            @PathVariable String productId,
            @RequestParam int quantity) {
        Cart updatedCart = cartService.updateItemQuantity(cartId, productId, quantity);
        media_shopResponse<Cart> response = new media_shopResponse<>(
            Constants.SUCCESS_CODE,
            "Update quantity successfully",
            updatedCart
        );
        return ResponseEntity.ok(response);
}

}
