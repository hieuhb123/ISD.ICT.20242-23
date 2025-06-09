package com.media_shop.controller;

import com.media_shop.entity.product.Book;
import com.media_shop.entity.product.CD;
import com.media_shop.entity.product.DVD;
import com.media_shop.entity.product.Product;
import com.media_shop.repository.media_shopResponse;
import com.media_shop.service.ProductService;
import com.media_shop.utils.Constants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
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

    @PostMapping("/add-cd")
    public ResponseEntity<media_shopResponse<Product>> addCD(@RequestBody CD product) {
        Product prod = productService.addCD(product);
        media_shopResponse<Product> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Add CD successfully", prod);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/add-book")
    public ResponseEntity<media_shopResponse<Product>> addBook(@RequestBody Book product) {
        Product prod = productService.addBook(product);
        media_shopResponse<Product> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Add book successfully", prod);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/add-dvd")
    public ResponseEntity<media_shopResponse<Product>> addDVD(@RequestBody DVD product) {
        Product prod = productService.addDVD(product);
        media_shopResponse<Product> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Add DVD successfully", prod);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<media_shopResponse<Product>> findProduct(@PathVariable String id) {
        Product product = productService.viewProduct(id);
        media_shopResponse<Product> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Get product successfully", product);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update-cd/{id}")
    public ResponseEntity<media_shopResponse<Product>> updateCD(@PathVariable String id, @RequestBody CD product) {
        Product newProduct = productService.updateCD(id, product);
        media_shopResponse<Product> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Update CD successfully", newProduct);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update-book/{id}")
    public ResponseEntity<media_shopResponse<Product>> updateBook(@PathVariable String id, @RequestBody Book product) {
        Product newProduct = productService.updateBook(id, product);
        media_shopResponse<Product> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Update book successfully", newProduct);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update-dvd/{id}")
    public ResponseEntity<media_shopResponse<Product>> updateDVD(@PathVariable String id, @RequestBody DVD product) {
        Product newProduct = productService.updateDVD(id, product);
        media_shopResponse<Product> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Update DVD successfully", newProduct);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<media_shopResponse<Void>> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        media_shopResponse<Void> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Delete product successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete-list")
    public ResponseEntity<media_shopResponse<Void>> deleteListProduct(@RequestParam List<String> ids) {
        productService.deleteListProduct(ids);
        media_shopResponse<Void> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Delete list product successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update-price/{id}")
    public ResponseEntity<media_shopResponse<Product>> updatePrice(@PathVariable String id, @RequestParam int newPrice) {
        Product newProduct = productService.updatePrice(id, newPrice);
        media_shopResponse<Product> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Update price successfully", newProduct);
        return ResponseEntity.ok(response);
    }


}
