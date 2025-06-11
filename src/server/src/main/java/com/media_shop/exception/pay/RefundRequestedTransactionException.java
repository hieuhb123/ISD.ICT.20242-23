package com.media_shop.exception.pay;

import com.media_shop.exception.PaymentException;

public class RefundRequestedTransactionException extends PaymentException {
    public RefundRequestedTransactionException() {
        super("VNPAY: VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)");
    }
}
