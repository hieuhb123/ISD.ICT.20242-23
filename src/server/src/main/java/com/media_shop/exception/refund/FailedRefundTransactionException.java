package com.media_shop.subsystem.exception.refund;

import com.media_shop.subsystem.exception.PaymentException;

public class FailedRefundTransactionException extends PaymentException {
    public FailedRefundTransactionException() {
        super("Giao dịch này không thành công bên VNPAY. VNPAY từ chối xử lý yêu cầui");
    }
}
