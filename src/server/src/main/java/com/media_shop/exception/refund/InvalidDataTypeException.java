package com.media_shop.exception.refund;

import com.media_shop.exception.PaymentException;

public class InvalidDataTypeException extends PaymentException {
    public InvalidDataTypeException() {
        super("Dữ liệu gửi sang không đúng định dạng");
    }
}
