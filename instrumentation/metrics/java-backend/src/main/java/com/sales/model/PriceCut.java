package com.sales.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class PriceCut {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long productId;
    
    private Double salePrice;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer maxItemsPerCustomer;
    
    @OneToMany(mappedBy = "priceCut")
    private List<CustomerPurchase> customerPurchases;
} 