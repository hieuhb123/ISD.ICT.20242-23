package com.media_shop.entity.payment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "payment_transaction")
public class PaymentTransaction {
    @Id
    private String id;
    private String userId;
    private String orderId;
    private long vnp_Amount;
    private String vnp_OrderInfo;
    private String vnp_ResponseCode;
    private String vnp_TransactionNo;
    private String vnp_BankCode;
    private String vnp_PayDate;
    private String vnp_TransactionStatus;
}
