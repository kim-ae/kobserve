package com.sales.repository;

import com.sales.model.PriceCut;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PriceCutRepository extends JpaRepository<PriceCut, Long> {
    List<PriceCut> findByProductId(Long productId);
} 