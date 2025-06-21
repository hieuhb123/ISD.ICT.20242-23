package com.media_shop.entity.order;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.List;
@Data
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String userId;
    private String shippingInfo;
    private String province;
    private double vat;
    private double shippingFee;
    private boolean cancellable;
    private List<OrderItem> items;
    private double total;
    private String status;
    private Boolean isRushOrder;
    private String createdAt;  

    public Order() {}

    public Order(String id, boolean cancellable, List<OrderItem> items, double total) {
        this.id = id;
        this.cancellable = cancellable;
        this.items = items;
        this.total = total;
    }
}
