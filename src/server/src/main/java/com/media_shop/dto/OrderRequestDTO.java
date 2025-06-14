package com.media_shop.dto;

import java.util.List;

public class OrderRequestDTO {
    private String userId;
    private String shippingAddress;
    private List<OrderItemDTO> items;

    public OrderRequestDTO() {}

    public OrderRequestDTO(String userId, String shippingAddress, List<OrderItemDTO> items) {
        this.userId = userId;
        this.shippingAddress = shippingAddress;
        this.items = items;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    public static class OrderItemDTO {
        private String productId;
        private int quantity;

        public OrderItemDTO() {}

        public OrderItemDTO(String productId, int quantity) {
            this.productId = productId;
            this.quantity = quantity;
        }

        public String getProductId() {
            return productId;
        }

        public void setProductId(String productId) {
            this.productId = productId;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }
}
