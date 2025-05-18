package com.media_shop.entity;

// High cohesion - holds order state and operations
// SRP respected - Order class encapsulates order-related data and state transitions

public class Order {
    private String id;
    private boolean cancellable;
    private boolean cancelled;

    public Order(String id, boolean cancellable) {
        this.id = id;
        this.cancellable = cancellable;
        this.cancelled = false;
    }

    public String getId() {
        return id;
    }

    public boolean isCancellable() {
        return cancellable;
    }

    public boolean isCancelled() {
        return cancelled;
    }

    public void cancel() {
        this.cancelled = true;
    }
}
