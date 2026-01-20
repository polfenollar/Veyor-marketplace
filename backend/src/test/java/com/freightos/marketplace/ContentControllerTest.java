package com.freightos.marketplace;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ContentControllerTest {

    @Mock
    private ContentRepository contentRepository;

    @InjectMocks
    private ContentController contentController;

    @Test
    public void testGetAllContent() {
        // Arrange
        ContentItem item1 = new ContentItem("Title 1", "Body 1", "ANNOUNCEMENT", "PUBLISHED");
        ContentItem item2 = new ContentItem("Title 2", "Body 2", "BANNER", "DRAFT");
        when(contentRepository.findAll()).thenReturn(Arrays.asList(item1, item2));

        // Act
        List<ContentItem> result = contentController.getAllContent();

        // Assert
        assertEquals(2, result.size());
    }

    @Test
    public void testCreateContent() {
        // Arrange
        ContentItem newItem = new ContentItem("New Title", "New Body", "ARTICLE", "DRAFT");
        when(contentRepository.save(any(ContentItem.class))).thenReturn(newItem);

        // Act
        ContentItem result = contentController.createContent(newItem);

        // Assert
        assertEquals("New Title", result.getTitle());
        verify(contentRepository, times(1)).save(newItem);
    }

    @Test
    public void testUpdateContent() {
        // Arrange
        Long id = 1L;
        ContentItem existingItem = new ContentItem("Old Title", "Old Body", "ARTICLE", "DRAFT");
        existingItem.setId(id);

        ContentItem updateDetails = new ContentItem("New Title", "New Body", "ARTICLE", "PUBLISHED");

        when(contentRepository.findById(id)).thenReturn(Optional.of(existingItem));
        when(contentRepository.save(any(ContentItem.class))).thenReturn(existingItem);

        // Act
        ResponseEntity<ContentItem> response = contentController.updateContent(id, updateDetails);

        // Assert
        assertEquals(200, response.getStatusCode().value());
        if (response.getBody() != null) {
            assertEquals("New Title", response.getBody().getTitle());
            assertEquals("PUBLISHED", response.getBody().getStatus());
        }
    }

    @Test
    public void testDeleteContent() {
        // Arrange
        Long id = 1L;
        doNothing().when(contentRepository).deleteById(id);

        // Act
        ResponseEntity<Void> response = contentController.deleteContent(id);

        // Assert
        assertEquals(204, response.getStatusCode().value());
        verify(contentRepository, times(1)).deleteById(id);
    }
}
