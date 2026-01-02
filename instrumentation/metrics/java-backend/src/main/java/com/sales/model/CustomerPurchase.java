package com.sales.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class CustomerPurchase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    private PriceCut priceCut;
    
    private String customerId;
    private Integer quantity;
    private LocalDateTime purchaseDate;
} 