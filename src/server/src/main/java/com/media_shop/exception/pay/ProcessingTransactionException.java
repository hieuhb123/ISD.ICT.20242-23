package com.media_shop.subsystem.exception.pay;

import com.media_shop.subsystem.exception.PaymentException;

public class ProcessingTransactionException extends PaymentException {
    public ProcessingTransactionException() {
        super("VNPAY: VNPAY đang xử lý giao dịch này (GD hoàn tiền)");
    }
}
