package com.media_shop.dto;

import com.media_shop.entity.product.Product;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CartProductDTO {
    private Product product;
    private int statusCode;
    private int quantity;
}