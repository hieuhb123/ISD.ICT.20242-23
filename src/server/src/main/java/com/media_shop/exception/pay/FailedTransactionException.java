package com.media_shop.exception.pay;

import com.media_shop.exception.PaymentException;

public class FailedTransactionException extends PaymentException {
    public FailedTransactionException() {
        super("VNPAY: Giao dịch bị lỗi");
    }
}
