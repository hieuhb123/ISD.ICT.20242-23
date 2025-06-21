package com.media_shop.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
public class CheckoutRequest {
    @Getter @Setter
    private String orderId;
    @Getter @Setter
    private boolean isRushOrder;
    @Getter @Setter
    private String province;
    @Getter @Setter
    private List<CartItemDTO> cartItems;

}
