package com.media_shop.repository;

import com.media_shop.entity.Product;

import java.util.Optional;

public interface ProductRepository {
    Optional<Product> findById(int id);
}
