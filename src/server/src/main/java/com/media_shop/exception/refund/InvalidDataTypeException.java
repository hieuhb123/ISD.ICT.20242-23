package com.media_shop.subsystem.exception.refund;

import com.media_shop.subsystem.exception.PaymentException;

public class InvalidDataTypeException extends PaymentException {
    public InvalidDataTypeException() {
        super("Dữ liệu gửi sang không đúng định dạng");
    }
}
