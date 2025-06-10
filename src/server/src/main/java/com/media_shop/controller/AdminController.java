package com.media_shop.controller;


import com.media_shop.repository.media_shopResponse;
import com.media_shop.entity.user.*;
import com.media_shop.service.UserService;
import com.media_shop.utils.Constants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login/ProductManager")
    public ResponseEntity<media_shopResponse<ProductManager>> login(@RequestBody ProductManager loginRequest) {
        ProductManager user = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
        media_shopResponse<ProductManager> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Login successfully", user);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/login/admin")
    public ResponseEntity<media_shopResponse<String>> loginAdmin(@RequestBody admin loginRequest) {
        if ("admin".equals(loginRequest.getUsername()) && "admin".equals(loginRequest.getPassword())) {
            media_shopResponse<String> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Login successfully", "admin");
            return ResponseEntity.ok(response);
        } else {
            media_shopResponse<String> response = new media_shopResponse<>(Constants.ERROR_CODE, "Invalid credentials", null);
            return ResponseEntity.status(401).body(response);
        }
    }


    @PostMapping("/create")
    public ResponseEntity<media_shopResponse<ProductManager>> createUser(@RequestBody ProductManager registerRequest) {
        ProductManager user = userService.createUser(registerRequest.getUsername(), registerRequest.getPassword());
        System.out.println("Create new user successfully");
        media_shopResponse<ProductManager> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Create new user successfully",user);
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

//    @PutMapping("/update/{id}")
//    public ResponseEntity<media_shopResponse<User>> updateUser(@PathVariable String id, @RequestBody User newUser) {
//        User user = userService.updateUser(id, newUser);
//        media_shopResponse<User> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Update user successfully", user);
//        return ResponseEntity.ok(response);
//    }

    @GetMapping("/all")
    public ResponseEntity<media_shopResponse<List<ProductManager>>> getAllUsers() {
        List<ProductManager> users = userService.getAllProductManager();
        media_shopResponse<List<ProductManager>> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Get all users successfully", users);
        return ResponseEntity.ok(response);
    }

}
