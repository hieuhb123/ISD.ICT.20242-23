package com.media_shop.Controller;

public class ProductController {
    private final ProductRepository productRepo;

    public ProductController(ProductRepository productRepo) {
        this.productRepo = productRepo;
    }

    public Product viewProduct(Integer productId) {
        if (productId == null) {
            throw new IllegalArgumentException("Product ID must not be null");
        }

        return productRepo.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with ID: " + productId));
    }
}
