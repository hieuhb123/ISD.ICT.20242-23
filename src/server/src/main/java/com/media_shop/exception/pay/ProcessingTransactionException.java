package com.media_shop.exception.pay;

import com.media_shop.exception.PaymentException;

public class ProcessingTransactionException extends PaymentException {
    public ProcessingTransactionException() {
        super("VNPAY: VNPAY đang xử lý giao dịch này (GD hoàn tiền)");
    }
}
