package com.media_shop.subsystem.exception.pay;

import com.media_shop.subsystem.exception.PaymentException;

public class IncompletTransactionException extends PaymentException {
    public IncompletTransactionException() {
        super("VNPAY: Giao dịch chưa hoàn tất");
    }
}
