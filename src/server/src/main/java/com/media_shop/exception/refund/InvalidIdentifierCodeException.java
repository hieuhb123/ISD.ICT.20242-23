package com.media_shop.subsystem.exception.refund;

import com.media_shop.subsystem.exception.PaymentException;

public class InvalidIdentifierCodeException extends PaymentException {
    public InvalidIdentifierCodeException() {
        super("Mã định danh kết nối không hợp lệ (kiểm tra lại TmnCode)");
    }
}
