package com.media_shop.exception.pay;

import com.media_shop.exception.PaymentException;

public class SuspiciousTransactionException extends PaymentException {
    public SuspiciousTransactionException() {
        super("VNPAY: Giao dịch nghi ngờ gian lận");
    }
}
