package com.sales.repository;

import com.sales.model.CustomerPurchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface CustomerPurchaseRepository extends JpaRepository<CustomerPurchase, Long> {
    List<CustomerPurchase> findByCustomerIdAndPriceCutId(String customerId, Long priceCutId);
    @Query("SELECT SUM(cp.quantity) FROM CustomerPurchase cp WHERE cp.customerId = :customerId AND cp.priceCut.id = :priceCutId")
    Integer sumQuantityByCustomerIdAndPriceCutId(String customerId, Long priceCutId);
} 