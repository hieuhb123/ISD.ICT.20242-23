package com.media_shop.service;

import com.media_shop.dto.OrderRequestDTO;
import com.media_shop.entity.order.Order;

public interface OrderService {
    Order placeOrder(OrderRequestDTO orderRequestDTO);
}
