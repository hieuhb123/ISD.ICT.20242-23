package com.media_shop.subsystem.exception.pay;

import com.media_shop.subsystem.exception.PaymentException;

public class RefundRejectedTransactionException extends PaymentException {
    public RefundRejectedTransactionException() {
        super("VNPAY: Giao dịch hoàn tiền bị từ chối");
    }
}
