package com.media_shop.subsystem.exception.refund;

import com.media_shop.subsystem.exception.PaymentException;

public class InvalidCheckSumException extends PaymentException {
    public InvalidCheckSumException() {
        super("Checksum không hợp lệ");
    }
}
