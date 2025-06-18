package com.media_shop.entity.cart;

// import com.media_shop.entity.product.Product;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CartItem {
    private String productId;
    private int quantity;
}


