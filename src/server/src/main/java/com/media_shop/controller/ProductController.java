package com.media_shop.controller;

import com.media_shop.entity.product.Product;
import com.media_shop.repository.media_shopResponse;
import com.media_shop.service.ProductService;
import com.media_shop.utils.Constants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/product")
public class ProductController {
    private final ProductService productService;
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/all")
    public ResponseEntity<media_shopResponse<List<Product>>> getAllProducts() {
        List<Product> products = productService.viewAllProduct();
        media_shopResponse<List<Product>> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Get all products successfully", products);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<media_shopResponse<?>> findProduct(@PathVariable String id) {
        Product product = productService.viewProduct(id);
        media_shopResponse<?> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Get product successfully", product);
        return ResponseEntity.ok(response);
    }

}
