package com.media_shop.exception.pay;

import com.media_shop.exception.PaymentException;

public class RefundRejectedTransactionException extends PaymentException {
    public RefundRejectedTransactionException() {
        super("VNPAY: Giao dịch hoàn tiền bị từ chối");
    }
}
