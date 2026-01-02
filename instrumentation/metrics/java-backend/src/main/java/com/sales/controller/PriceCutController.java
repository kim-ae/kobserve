package com.sales.controller;

import com.sales.model.PriceCut;
import com.sales.service.PriceCutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/price-cuts")
public class PriceCutController {
    
    @Autowired
    private PriceCutService priceCutService;
    
    @GetMapping
    public List<PriceCut> getAllPriceCuts() {
        return priceCutService.getAllPriceCuts();
    }
    
    @GetMapping("/product/{productId}")
    public List<PriceCut> getPriceCutsByProductId(@PathVariable Long productId) {
        return priceCutService.getPriceCutsByProductId(productId);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PriceCut> getPriceCutById(@PathVariable Long id) {
        return priceCutService.getPriceCutById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public PriceCut createPriceCut(@RequestBody PriceCut priceCut) {
        return priceCutService.createPriceCut(priceCut);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PriceCut> updatePriceCut(@PathVariable Long id, @RequestBody PriceCut priceCut) {
        PriceCut updatedPriceCut = priceCutService.updatePriceCut(id, priceCut);
        if (updatedPriceCut != null) {
            return ResponseEntity.ok(updatedPriceCut);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePriceCut(@PathVariable Long id) {
        priceCutService.deletePriceCut(id);
        return ResponseEntity.ok().build();
    }
} 