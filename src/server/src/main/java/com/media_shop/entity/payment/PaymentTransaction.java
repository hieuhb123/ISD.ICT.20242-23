package com.aims.entity.payment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;



@Document(collection = "payment_transaction")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentTransaction {
    @Id
    private String transactionId;
    private String orderId;
    private String errorCode; // code response from bank
    private long amount;
    private String transactionNum;
    private String transactionContent;
    private String message;
    private String createdAt;
}
