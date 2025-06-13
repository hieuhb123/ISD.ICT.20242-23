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
    protected String description;
    protected String category;
    protected double price;
    protected int quantity;
    protected String weight;
    protected String dimension;
    protected String imageURL;
    protected boolean isDeleted;
    private boolean rushDeliverySupport;
}

