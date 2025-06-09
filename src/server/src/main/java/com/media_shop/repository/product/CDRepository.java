package com.media_shop.repository.product;

import com.media_shop.entity.product.CD;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CDRepository extends MongoRepository<CD, String>{
}
