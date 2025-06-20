package com.media_shop.service;

import com.media_shop.entity.order.Order;

public interface OrderService {
    Order placeOrder(Order orderRequest, String cartId);
}
