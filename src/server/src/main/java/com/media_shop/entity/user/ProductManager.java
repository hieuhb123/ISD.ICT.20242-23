package com.media_shop.entity.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;


@Document(collection = "product-manager")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductManager {
    @Id
    private String id;
    private String username;
    private String password;
    private List<String> ownProductIds;
    private Boolean blockStatus;
}