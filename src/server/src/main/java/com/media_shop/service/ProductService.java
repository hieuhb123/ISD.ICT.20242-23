package com.media_shop.service;

import com.media_shop.entity.product.Book;
import com.media_shop.entity.product.CD;
import com.media_shop.entity.product.DVD;
import com.media_shop.entity.product.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductService {
    List<Product> viewAllProduct();
    Product viewProduct(String id);
}
