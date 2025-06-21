package com.media_shop.entity.order;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "order_items")
public class OrderItem {
    private String productId;
    private String title;
    protected String imageURL;
    private int quantity;
    private double price;

}
