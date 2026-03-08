package com.veyor.marketplace.modules.catalog;

import com.veyor.marketplace.modules.identity.User;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/commodities")
public class CommodityTemplateController {

    private final CommodityTemplateRepository commodityTemplateRepository;

    public CommodityTemplateController(CommodityTemplateRepository commodityTemplateRepository) {
        this.commodityTemplateRepository = commodityTemplateRepository;
    }

    @GetMapping
    public ResponseEntity<List<CommodityTemplate>> getTemplates() {
        String userId = "current_user";
        return ResponseEntity.ok(commodityTemplateRepository.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<CommodityTemplate> createTemplate(@RequestBody CommodityTemplate template) {
        String userId = "current_user";
        template.setUserId(userId);
        return ResponseEntity.ok(commodityTemplateRepository.save(template));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Long id) {
        commodityTemplateRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
