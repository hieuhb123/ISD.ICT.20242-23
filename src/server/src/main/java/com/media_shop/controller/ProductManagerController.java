package com.media_shop.controller;


import com.media_shop.repository.media_shopResponse;
import com.media_shop.entity.product.*;
import com.media_shop.entity.user.*;
import com.media_shop.service.UserService;
import com.media_shop.utils.Constants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/ProductManager")
public class ProductManagerController {

    private final UserService userService;

    public ProductManagerController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<media_shopResponse<ProductManager>> login(@RequestBody ProductManager loginRequest) {
        ProductManager user = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
        media_shopResponse<ProductManager> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Login successfully", user);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<media_shopResponse<Void>> deleteUser(@RequestParam String userId) {
        userService.deleteUser(userId);
        media_shopResponse<Void> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Delete user successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/change-password")
    public ResponseEntity<media_shopResponse<ProductManager>> changePassword(@RequestParam String userId, @RequestParam String currentPassword, @RequestParam String newPassword) {
        ProductManager user = userService.changePassword(userId, currentPassword, newPassword);
        media_shopResponse<ProductManager> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Change password successfully", user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/add-cd")
    public ResponseEntity<media_shopResponse<Product>> addCD(@RequestParam String userId, @RequestBody CD product) {
        Product prod = userService.addCD(userId, product);
        media_shopResponse<Product> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Add CD successfully", prod);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/add-book")
    public ResponseEntity<media_shopResponse<Product>> addBook(@RequestParam String userId, @RequestBody Book product) {
        Product prod = userService.addBook(userId, product);
        media_shopResponse<Product> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Add book successfully", prod);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/add-dvd")
    public ResponseEntity<media_shopResponse<Product>> addDVD(@RequestParam String userId, @RequestBody DVD product) {
        Product prod = userService.addDVD(userId, product);
        media_shopResponse<Product> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Add DVD successfully", prod);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update-cd/{id}")
    public ResponseEntity<media_shopResponse<Product>> updateCD(@PathVariable String id, @RequestBody CD product) {
        Product newProduct = userService.updateCD(id, product);
        media_shopResponse<Product> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Update CD successfully", newProduct);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update-book/{id}")
    public ResponseEntity<media_shopResponse<Product>> updateBook(@PathVariable String id, @RequestBody Book product) {
        Product newProduct = userService.updateBook(id, product);
        media_shopResponse<Product> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Update book successfully", newProduct);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update-dvd/{id}")
    public ResponseEntity<media_shopResponse<Product>> updateDVD(@PathVariable String id, @RequestBody DVD product) {
        Product newProduct = userService.updateDVD(id, product);
        media_shopResponse<Product> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Update DVD successfully", newProduct);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<media_shopResponse<Void>> deleteProduct(@RequestParam String userId, @PathVariable String id) {
        userService.deleteProduct(userId, id);
        media_shopResponse<Void> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Delete product successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete-list")
    public ResponseEntity<media_shopResponse<Void>> deleteListProduct(@RequestParam String userId, @RequestParam List<String> ids) {
        userService.deleteListProduct(userId, ids);
        media_shopResponse<Void> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Delete list product successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update-price/{id}")
    public ResponseEntity<media_shopResponse<Product>> updatePrice(@PathVariable String id, @RequestParam int newPrice) {
        Product newProduct = userService.updatePrice(id, newPrice);
        media_shopResponse<Product> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Update price successfully", newProduct);
        return ResponseEntity.ok(response);
    }

}
