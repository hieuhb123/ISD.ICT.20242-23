package com.media_shop.service;

import com.media_shop.entity.product.Product;
import com.media_shop.entity.user.ProductManager;
import com.media_shop.exception.*;
import com.media_shop.repository.product.ProductRepository;
import com.media_shop.repository.user.DeletionLogRepository;
import com.media_shop.repository.user.ProductManagerRepository;
import com.media_shop.service.implementation.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    // --- Mocks for required dependencies ---
    @Mock
    private ProductManagerRepository userRepository;
    @Mock
    private ProductRepository productRepository; // The ONLY repository for all products
    @Mock
    private DeletionLogRepository deletionLogRepository;

    // --- Inject mocks into the service we are testing ---
    @InjectMocks
    private UserServiceImpl userService;

    // --- Test Data Objects ---
    private ProductManager testManager;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        // Create a standard ProductManager for tests
        testManager = new ProductManager();
        testManager.setId("user123");
        testManager.setUsername("testuser");
        testManager.setPassword("password123");
        testManager.setBlockStatus(false);
        testManager.setOwnProductIds(new ArrayList<>());

        // Create a standard, generic Product for tests
        testProduct = new Product();
        testProduct.setId("prod456");
        testProduct.setTitle("A Great Product");
        testProduct.setPrice(100);
    }

    // --- User Management Tests ---

    @Test
    void testCreateUser_Success() {
        // Arrange
        when(userRepository.findAll()).thenReturn(List.of());
        when(userRepository.save(any(ProductManager.class))).thenReturn(testManager);

        // Act
        ProductManager createdUser = userService.createUser("testuser", "password123");

        // Assert
        assertNotNull(createdUser);
        assertEquals("testuser", createdUser.getUsername());
        verify(userRepository, times(1)).save(any(ProductManager.class));
    }

    @Test
    void testCreateUser_Existed() {
        // Arrange
        when(userRepository.findAll()).thenReturn(List.of(testManager));

        // Act & Assert
        assertThrows(UserExistedException.class, () -> userService.createUser("testuser", "password123"));
        verify(userRepository, never()).save(any());
    }
    
    // --- Product & User Interaction Tests ---
    
    // This test assumes you have a generic addProduct method. 
    // We use `addBook` here as it's in your interface, but mock the generic productRepository.
    @Test
    void testAddProduct_Success() {
        // Arrange
        when(userRepository.findById("user123")).thenReturn(Optional.of(testManager));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // Act
        // Assumes an addProduct method exists, we use addBook as a placeholder from your interface
        Product savedProduct = userService.addBook("user123", null); // We pass null as the specific type doesn't matter

        // Assert
        assertNotNull(savedProduct);
        assertEquals("prod456", savedProduct.getId());
        assertTrue(testManager.getOwnProductIds().contains("prod456"));
        verify(userRepository, times(1)).save(testManager); // Verify the user's product list was updated
        verify(productRepository, times(1)).save(any(Product.class)); // Verify the generic repo was used
    }
    
    @Test
    void testUpdateProduct_Success() {
        // Arrange
        Product updatedDetails = new Product();
        updatedDetails.setTitle("An Even Greater Product");
        updatedDetails.setPrice(150);

        when(productRepository.findById("prod456")).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct); 

        // Act
        // Assumes a generic updateProduct method exists
        Product result = userService.updateBook("prod456", null); // Using updateBook as a placeholder

        // Assert
        assertNotNull(result);
        assertEquals("An Even Greater Product", result.getTitle());
        assertEquals(150, result.getPrice());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    // --- Bulk Deletion Tests ---
    
    @Test
    @Transactional
    void testDeleteListProduct_Success() {
        // Arrange
        List<String> idsToDelete = List.of("prod1", "prod2");
        Product product1 = new Product();
        product1.setId("prod1");
        Product product2 = new Product();
        product2.setId("prod2");
        List<Product> productsToDelete = List.of(product1, product2);
        testManager.getOwnProductIds().addAll(idsToDelete);

        when(userRepository.findById("user123")).thenReturn(Optional.of(testManager));
        when(deletionLogRepository.countByManagerIdAndDeletedAtAfter(anyString(), any(LocalDateTime.class))).thenReturn(0L);
        when(productRepository.findAllById(idsToDelete)).thenReturn(productsToDelete);

        // Act
        userService.deleteListProduct("user123", idsToDelete);

        // Assert
        verify(productRepository, times(1)).saveAll(anyList());
        verify(deletionLogRepository, times(1)).saveAll(anyList());
        verify(userRepository, times(1)).save(testManager);
        assertTrue(testManager.getOwnProductIds().isEmpty());
    }
}