package com.media_shop.service.implementation;

import com.media_shop.entity.product.Product;
import com.media_shop.exception.ProductNotFoundException;
import com.media_shop.repository.product.*;
import com.media_shop.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    @Override
    public List<Product> viewAllProduct() {
        return productRepository.findAll()
                .stream()
                .filter(product -> !product.isDeleted())
                .toList();
    }

    @Override
    public Product viewProduct(String id){
        Product product = productRepository.findById(id).orElse(null);
        System.out.println("Product found: " + product);
        if (product != null) {
            return product;
        } else {
            throw new ProductNotFoundException("Product not found");
        }
    }

}
