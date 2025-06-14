package com.media_shop.entity.order;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private boolean cancellable;
    private boolean cancelled;
    private List<OrderItem> items;
    private double total;

    public Order() {}

    public Order(String id, boolean cancellable, List<OrderItem> items, double total) {
        this.id = id;
        this.cancellable = cancellable;
        this.cancelled = false;
        this.items = items;
        this.total = total;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public boolean isCancellable() {
        return cancellable;
    }

    public void setCancellable(boolean cancellable) {
        this.cancellable = cancellable;
    }

    public boolean isCancelled() {
        return cancelled;
    }

    public void setCancelled(boolean cancelled) {
        this.cancelled = cancelled;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public void cancel() {
        this.cancelled = true;
    }
}
