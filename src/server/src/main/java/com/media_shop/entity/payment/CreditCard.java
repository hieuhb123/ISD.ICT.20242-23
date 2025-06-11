package com.aims.entity.payment;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "credit_card")
public class CreditCard {
    private String cardNumber;
    private String cardHolder;
    private String expiredDate;
    private String cvv;
}
