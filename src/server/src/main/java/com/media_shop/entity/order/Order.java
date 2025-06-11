package com.aims.entity.order;

import com.aims.entity.delivery.DeliveryInfo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "order")
public class Order {
    @Id
    private String orderId;
    private String cartId;
    private List<OrderItem> listOrderItem;
    private DeliveryInfo deliveryInfo;
    private int totalAmount;
    private String status;
}