package com.media_shop.exception.refund;

import com.media_shop.exception.PaymentException;

public class ProcessingRefundException extends PaymentException {
    public ProcessingRefundException() {
        super("Yêu cầu trùng lặp, duplicate request trong thời gian giới hạn của API");
    }
}
