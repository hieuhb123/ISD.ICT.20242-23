package com.media_shop.controller;

import com.media_shop.entity.cart.Cart;
import com.media_shop.entity.product.Product;
import com.media_shop.repository.product.ProductRepository;
import com.media_shop.repository.media_shopResponse;
import com.media_shop.exception.ProductNotFoundException;
import com.media_shop.service.CartService;
import com.media_shop.utils.Constants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final ProductRepository productRepository;

    public CartController(CartService cartService, ProductRepository productRepository) {
        this.cartService = cartService;
        this.productRepository = productRepository;
    }

    @GetMapping("/{cartId}")
    public ResponseEntity<media_shopResponse<Cart>> getCart(@PathVariable String cartId) {
        Cart cart =cartService.getCart(cartId);
        media_shopResponse<Cart> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Get cart successfully", cart);
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
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
        Cart cart = cartService.addItem(cartId, product, quantity);
        media_shopResponse<Cart> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Add product to cart successfully", cart);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{cartId}/remove")
    public ResponseEntity<media_shopResponse<Cart>> removeCartProduct(@PathVariable String cartId, @RequestParam String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
        Cart cart =  cartService.removeItem(cartId, product);
        media_shopResponse<Cart> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Remove product from cart successfully", cart);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{cartId}/clear")
    public ResponseEntity<media_shopResponse<Cart>> clearCart(@PathVariable String cartId) {
        Cart cart = cartService.clearCart(cartId);
        media_shopResponse<Cart> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Clear cart successfully", cart);
        return ResponseEntity.ok(response);
    }

}
