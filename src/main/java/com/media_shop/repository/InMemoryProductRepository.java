package com.media_shop.repository;

import com.media_shop.entity.Product;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class InMemoryProductRepository implements ProductRepository {
    private final Map<Integer, Product> products = new HashMap<>();

    public InMemoryProductRepository() {
        // Giả lập database với 2 sản phẩm
        products.put(1, new Product(1, "DVD", 20.0));
        products.put(2, new Product(2, "Book", 10.0));
    }

    @Override
    public Optional<Product> findById(int productId) {
        return Optional.ofNullable(products.get(productId));
    }
}
