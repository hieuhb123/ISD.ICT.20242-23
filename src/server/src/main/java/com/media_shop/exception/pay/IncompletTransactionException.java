package com.media_shop.exception.pay;

import com.media_shop.exception.PaymentException;

public class IncompletTransactionException extends PaymentException {
    public IncompletTransactionException() {
        super("VNPAY: Giao dịch chưa hoàn tất");
    }
}
