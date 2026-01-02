package com.sales.controller;

import com.sales.model.CustomerPurchase;
import com.sales.service.CustomerPurchaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class CustomerPurchaseController {
    
    @Autowired
    private CustomerPurchaseService customerPurchaseService;
    
    @GetMapping("/customer/{customerId}/price-cut/{priceCutId}")
    public List<CustomerPurchase> getCustomerPurchases(
            @PathVariable String customerId,
            @PathVariable Long priceCutId) {
        return customerPurchaseService.getCustomerPurchases(customerId, priceCutId);
    }
    
    @PostMapping("/process")
    public ResponseEntity<CustomerPurchase> processPurchase(
            @RequestParam String customerId,
            @RequestParam Long priceCutId,
            @RequestParam Integer quantity) {
        try {
            CustomerPurchase purchase = customerPurchaseService.processPurchase(customerId, priceCutId, quantity);
            return ResponseEntity.ok(purchase);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 