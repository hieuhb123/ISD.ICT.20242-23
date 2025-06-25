package com.media_shop.service.implementation;

import com.media_shop.dto.CartItemDTO;
import com.media_shop.entity.cart.Cart;
import com.media_shop.entity.cart.CartItem;
import com.media_shop.entity.product.Product;
import com.media_shop.repository.cart.CartRepository;
import com.media_shop.repository.product.ProductRepository;
import com.media_shop.service.CartService;
import com.media_shop.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    @Autowired
    private ProductRepository productRepository;
    public CartServiceImpl(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    public Cart getCart(String cartId) {
        return cartRepository.findById(cartId).orElse(new Cart(cartId, new ArrayList<>(), 0));
    }

    @Override
    public Cart createCart() {
        return cartRepository.save(new Cart());
    }

    @Override
    public Cart addItem(String cartId, String productID, int quantity) {
        Cart cart = getCart(cartId);

        // Lấy sản phẩm từ DB
        Product product = productRepository.findById(productID).orElse(null);
        if (product == null || product.isDeleted()) {
            throw new IllegalArgumentException("Product not found or has been deleted");
        }
        if (product.getQuantity() < quantity) {
            throw new IllegalArgumentException("Product is out of stock");
        }

        if (cart.getListCartItem() == null) {
            cart.setListCartItem(new ArrayList<>());
        }

        Optional<CartItem> existingItem = cart.getListCartItem().stream()
                .filter(item -> item.getProductId().equals(productID))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
        } else {
            cart.getListCartItem().add(new CartItem(productID, quantity));
        }

        // Tính lại tổng tiền
        cart.setTotalPrice(cart.getListCartItem().stream()
                .mapToDouble(item -> {
                    Product p = productRepository.findById(item.getProductId()).orElse(null);
                    return (p != null && !p.isDeleted()) ? p.getPrice() * item.getQuantity() : 0;
                })
                .sum());
        return cartRepository.save(cart);
    }

    @Override
    public Cart removeItem(String cartId, String productId) {
        Cart cart = getCart(cartId);
        if (cart.getListCartItem() != null) {
            cart.getListCartItem().removeIf(item -> item.getProductId().equals(productId));
        }

        cart.setTotalPrice(cart.getListCartItem().stream()
                .mapToDouble(item -> {
                    return 0;
                })
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
    public List<CartItemDTO> getAllCartItems(String cartId) {
        Cart cart = getCart(cartId);
        List<CartItemDTO> result = new ArrayList<>();
        if (cart.getListCartItem() != null) {
            for (CartItem item : cart.getListCartItem()) {
                Product product = productRepository.findById(item.getProductId()).orElse(null);
                int statusCode;
                if (product == null || product.isDeleted()) {
                    statusCode = Constants.PRODUCT_STATUS_DELETED_CODE; // Đã xóa
                } else if (product.getQuantity() - item.getQuantity() < 0) {
                    statusCode = Constants.PRODUCT_STATUS_OUT_OF_TOCK_CODE; // Hết hàng
                } else {
                    statusCode = Constants.PRODUCT_STATUS_IN_STOCK_CODE; // Còn hàng
                }
                result.add(new CartItemDTO(product, statusCode, item.getQuantity()));
            }
        }
        return result;
    }

    @Override
    public double getTotalPrice(String cartId) {
        Cart cart = getCart(cartId);
        return cart.getTotalPrice();
    }
}
