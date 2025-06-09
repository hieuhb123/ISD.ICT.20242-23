package com.media_shop.repository.product;

import com.media_shop.entity.product.DVD;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DVDRepository extends MongoRepository<DVD, String> {
}
