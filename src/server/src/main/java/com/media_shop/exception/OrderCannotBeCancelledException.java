package com.media_shop.exception;

public class OrderCannotBeCancelledException extends RuntimeException {
    public OrderCannotBeCancelledException(String id) {
        super("Order cannot be cancelled: " + id);
    }
}
