package com.media_shop.entity.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "product")
public class Product {
    @Id
    protected String id;
    protected String title;
    protected String category;
    protected int price;
    protected int quantity;
    protected int weight;
    protected String dimension;
    protected String imageURL;
    private boolean rushDeliverySupport;
}

