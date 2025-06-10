package com.media_shop.exception;

public class UserExistedException extends RuntimeException{
    public UserExistedException(String message) {
        super(message);
    }
}
