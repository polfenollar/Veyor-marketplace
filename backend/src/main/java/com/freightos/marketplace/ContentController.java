package com.freightos.marketplace;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/content")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class ContentController {

    private final ContentRepository contentRepository;

    public ContentController(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    @GetMapping
    public List<ContentItem> getAllContent() {
        return contentRepository.findAll();
    }

    @PostMapping
    public ContentItem createContent(@RequestBody ContentItem contentItem) {
        contentItem.setCreatedAt(java.time.LocalDateTime.now());
        contentItem.setUpdatedAt(java.time.LocalDateTime.now());
        return contentRepository.save(contentItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContentItem> updateContent(@PathVariable Long id, @RequestBody ContentItem details) {
        return contentRepository.findById(id)
                .map(item -> {
                    item.setTitle(details.getTitle());
                    item.setBody(details.getBody());
                    item.setType(details.getType());
                    item.setStatus(details.getStatus());
                    item.setUpdatedAt(java.time.LocalDateTime.now());
                    return ResponseEntity.ok(contentRepository.save(item));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContent(@PathVariable Long id) {
        contentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
