package com.sales.service;

import com.sales.model.PriceCut;
import com.sales.repository.PriceCutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PriceCutService {
    
    @Autowired
    private PriceCutRepository priceCutRepository;
    
    public List<PriceCut> getAllPriceCuts() {
        return priceCutRepository.findAll();
    }
    
    public List<PriceCut> getPriceCutsByProductId(Long productId) {
        return priceCutRepository.findByProductId(productId);
    }
    
    public Optional<PriceCut> getPriceCutById(Long id) {
        return priceCutRepository.findById(id);
    }
    
    public PriceCut createPriceCut(PriceCut priceCut) {
        return priceCutRepository.save(priceCut);
    }
    
    public PriceCut updatePriceCut(Long id, PriceCut priceCut) {
        if (priceCutRepository.existsById(id)) {
            priceCut.setId(id);
            return priceCutRepository.save(priceCut);
        }
        return null;
    }
    
    public void deletePriceCut(Long id) {
        priceCutRepository.deleteById(id);
    }
} 