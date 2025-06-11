package com.aims.subsystem.vnpay.refund;

import com.aims.entity.payment.RefundTransaction;
import com.aims.exception.AIMSException;
import com.aims.exception.payment.refund.*;
import lombok.AllArgsConstructor;

import java.util.Map;

@AllArgsConstructor
public class RefundResponse {
    Map<String, String> response;
    public RefundTransaction getRefundTransactionResponse(){
        if (response == null) {
            return null;
        }
        // Create Payment transaction
        String errorCode = response.get("vnp_ResponseCode");
        String id = response.get("vnp_ResponseId");
        String message = response.get("vnp_Message");
        int amount = Integer.parseInt(response.get("vnp_Amount")) / 100;
        String content = response.get("vnp_OrderInfo");

        RefundTransaction refundTransaction = new RefundTransaction(id, message, errorCode, amount, content);

        switch (refundTransaction.getErrorCode()) {
            case "00":
                break;
            case "02":
                throw new InvalidIdentifierCodeException();
            case "03":
                throw new InvalidDataTypeException();
            case "91":
                throw new NotFoundTransactionException();
            case "94":
                throw new ProcessingRefundException();
            case "95":
                throw new FailedRefundTransactionException();
            case "97":
                throw new InvalidCheckSumException();
            default:
                throw new AIMSException();
        }
        return refundTransaction;
    }

}
