package com.media_shop.repository;

import lombok.Data;
@Data

public class media_shopResponse<T> {
     private int code;
     private String message;
     private T data;

    public media_shopResponse(int code, String message) {
        this.code = code;
        this.message = message;
    }

     public media_shopResponse(int code, String message, T data) {
         this.code = code;
         this.message = message;
         this.data = data;
     }

     // Getters and Setters
 }