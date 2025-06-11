package com.media_shop.exception.refund;

import com.media_shop.exception.PaymentException;

public class FailedRefundTransactionException extends PaymentException {
    public FailedRefundTransactionException() {
        super("Giao dịch này không thành công bên VNPAY. VNPAY từ chối xử lý yêu cầui");
    }
}
