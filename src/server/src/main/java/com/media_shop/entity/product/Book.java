package com.media_shop.entity.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "product")
public class Book extends Product {
    private String author;
    private String coverType;
    private String publisher;
    private Date publishDate;
    private int numOfPages;
    private String language;
    private List<String> bookCategory;
}