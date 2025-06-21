package com.media_shop.dto;

import lombok.Getter;

public class CartItemDTO {
    @Getter
    private String productId;
    @Getter
    private int quantity;
    @Getter
    private double unitPrice;


}
