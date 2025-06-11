package com.media_shop.exception.refund;

import com.media_shop.exception.PaymentException;

public class InvalidCheckSumException extends PaymentException {
    public InvalidCheckSumException() {
        super("Checksum không hợp lệ");
    }
}
