package com.media_shop.entity.product;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "productType"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = CD.class, name = "cd"),
        @JsonSubTypes.Type(value = Book.class, name = "book"),
        @JsonSubTypes.Type(value = DVD.class, name = "dvd")
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "product")
public class Product {
    @Id
    protected String id;
    protected String title;
    protected String description;
    protected String productType;
    protected double price;
    protected int quantity;
    protected double weight;
    protected String dimension;
    protected String imageURL;
    protected boolean isDeleted; // Giữ nguyên tên gốc
    private boolean rushDeliverySupport;
}