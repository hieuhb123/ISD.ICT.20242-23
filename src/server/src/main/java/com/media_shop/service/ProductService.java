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

    Product addCD(CD product);
    Product addBook(Book product);
    Product addDVD(DVD product);

    Product updateCD(String id, CD product);
    Product updateBook(String id, Book product);
    Product updateDVD(String id, DVD product);

    void deleteProduct(String id);
    void deleteListProduct(List<String> ids);

    Product updatePrice(String productId, int newPrice);

}
