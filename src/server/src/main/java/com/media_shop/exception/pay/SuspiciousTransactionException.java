package com.media_shop.subsystem.exception.pay;

import com.media_shop.subsystem.exception.PaymentException;

public class SuspiciousTransactionException extends PaymentException {
    public SuspiciousTransactionException() {
        super("VNPAY: Giao dịch nghi ngờ gian lận");
    }
}
