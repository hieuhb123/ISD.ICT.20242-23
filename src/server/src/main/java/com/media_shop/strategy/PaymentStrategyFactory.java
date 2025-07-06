package com.media_shop.strategy;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Component
public class PaymentStrategyFactory {

    private final Map<String, PaymentStrategy> strategies = new HashMap<>();
    public PaymentStrategyFactory(List<PaymentStrategy> strategyList){
        for(PaymentStrategy strategy : strategyList){
            strategies.put(strategy.getType(), strategy);
        }
    }

    public PaymentStrategy getStrategy(String type){
        if(!strategies.containsKey(type)){
            throw new IllegalArgumentException("Unsupported this payment method: " + type);
        }

        return strategies.get(type);
    }
}
