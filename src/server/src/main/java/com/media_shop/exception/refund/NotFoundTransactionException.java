package com.media_shop.subsystem.exception.refund;

import com.media_shop.subsystem.exception.PaymentException;

public class NotFoundTransactionException extends PaymentException {
    public NotFoundTransactionException() {
        super("Không tìm thấy giao dịch yêu cầu");
    }
}
