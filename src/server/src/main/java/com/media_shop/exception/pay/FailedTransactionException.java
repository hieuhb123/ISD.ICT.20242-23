package com.media_shop.subsystem.exception.pay;

import com.media_shop.subsystem.exception.PaymentException;

public class FailedTransactionException extends PaymentException {
    public FailedTransactionException() {
        super("VNPAY: Giao dịch bị lỗi");
    }
}
