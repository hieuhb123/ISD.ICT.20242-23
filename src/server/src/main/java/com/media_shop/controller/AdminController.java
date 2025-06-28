package com.media_shop.controller;


import com.media_shop.repository.media_shopResponse;
import com.media_shop.entity.user.*;
import com.media_shop.exception.UserNotFoundException;
import com.media_shop.service.UserService;
import com.media_shop.utils.Constants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<media_shopResponse<String>> loginAdmin    (@RequestBody admin loginRequest) {
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

    @PutMapping("/block")
    public ResponseEntity<media_shopResponse<ProductManager>> blockUser(@RequestParam String userId) {
        try {
            ProductManager user = userService.blockUser(userId);
            media_shopResponse<ProductManager> response = new media_shopResponse<>(
                    Constants.SUCCESS_CODE,
                    "User blocked successfully",
                    user
            );
            return ResponseEntity.ok(response);
        } catch (UserNotFoundException e) {
            media_shopResponse<ProductManager> response = new media_shopResponse<>(
                    Constants.ERROR_CODE,
                    e.getMessage(),
                    null
            );
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/unblock")
    public ResponseEntity<media_shopResponse<ProductManager>> unblockUser(@RequestParam String userId) {
        try {
            ProductManager user = userService.unblockUser(userId);
            media_shopResponse<ProductManager> response = new media_shopResponse<>(
                    Constants.SUCCESS_CODE,
                    "User unblocked successfully",
                    user
            );
            return ResponseEntity.ok(response);
        } catch (UserNotFoundException e) {
            media_shopResponse<ProductManager> response = new media_shopResponse<>(
                    Constants.ERROR_CODE,
                    e.getMessage(),
                    null
            );
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<media_shopResponse<List<ProductManager>>> getAllUsers() {
        List<ProductManager> users = userService.getAllProductManager();
        media_shopResponse<List<ProductManager>> response = new media_shopResponse<>(Constants.SUCCESS_CODE, "Get all users successfully", users);
        return ResponseEntity.ok(response);
    }

}
