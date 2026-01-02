package com.sales.service;

import com.sales.model.CustomerPurchase;
import com.sales.model.PriceCut;
import com.sales.repository.CustomerPurchaseRepository;
import com.sales.repository.PriceCutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CustomerPurchaseService {
    
    @Autowired
    private CustomerPurchaseRepository customerPurchaseRepository;
    
    @Autowired
    private PriceCutRepository priceCutRepository;
    
    public List<CustomerPurchase> getCustomerPurchases(String customerId, Long priceCutId) {
        return customerPurchaseRepository.findByCustomerIdAndPriceCutId(customerId, priceCutId);
    }
    
    @Transactional
    public CustomerPurchase processPurchase(String customerId, Long priceCutId, Integer quantity) {
        PriceCut priceCut = priceCutRepository.findById(priceCutId)
            .orElseThrow(() -> new RuntimeException("Price cut not found"));
            
        // Check if the sale is still active
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(priceCut.getStartDate()) || now.isAfter(priceCut.getEndDate())) {
            throw new RuntimeException("Sale is not active");
        }
        
        // Check if customer has exceeded the limit
        Integer currentQuantity = customerPurchaseRepository.sumQuantityByCustomerIdAndPriceCutId(customerId, priceCutId);
        if (currentQuantity == null) {
            currentQuantity = 0;
        }
        
        if (currentQuantity + quantity > priceCut.getMaxItemsPerCustomer()) {
            throw new RuntimeException("Purchase would exceed maximum items allowed per customer");
        }
        
        CustomerPurchase purchase = new CustomerPurchase();
        purchase.setCustomerId(customerId);
        purchase.setPriceCut(priceCut);
        purchase.setQuantity(quantity);
        purchase.setPurchaseDate(now);
        
        return customerPurchaseRepository.save(purchase);
    }
} 