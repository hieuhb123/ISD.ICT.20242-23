package com.media_shop.repository.user;

import com.media_shop.entity.user.ProductManager;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductManagerRepository extends MongoRepository<ProductManager, String> {
}