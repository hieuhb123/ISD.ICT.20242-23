package com.media_shop.service;

import com.media_shop.entity.product.Book;
import com.media_shop.entity.product.Product;
import com.media_shop.entity.user.ProductManager;
import com.media_shop.exception.*;
import com.media_shop.repository.product.BookRepository;
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

    // --- Mocks for all repository dependencies ---
    @Mock
    private ProductManagerRepository userRepository;
    @Mock
    private BookRepository bookRepository; // For product-related tests
    @Mock
    private ProductRepository productRepository;
    @Mock
    private DeletionLogRepository deletionLogRepository;

    // --- Inject mocks into the service we are testing ---
    @InjectMocks
    private UserServiceImpl userService;

    // --- Test Data Objects ---
    private ProductManager testManager;
    private Book testBook;

    @BeforeEach
    void setUp() {
        // Create a standard ProductManager for tests
        testManager = new ProductManager();
        testManager.setId("user123");
        testManager.setUsername("testuser");
        testManager.setPassword("password123");
        testManager.setBlockStatus(false);
        testManager.setOwnProductIds(new ArrayList<>());

        // Create a standard Book for tests
        testBook = new Book();
        testBook.setId("book456");
        testBook.setTitle("A Great Book");
        testBook.setPrice(100);
    }

    // --- User Management Tests ---

    @Test
    void testCreateUser_Success() {
        // Arrange: No existing user with the same name
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
        // Arrange: A user with the same name already exists
        when(userRepository.findAll()).thenReturn(List.of(testManager));

        // Act & Assert
        assertThrows(UserExistedException.class, () -> {
            userService.createUser("testuser", "password123");
        });
        verify(userRepository, never()).save(any()); // Ensure save was never called
    }

    @Test
    void testLogin_Success() {
        // Arrange
        when(userRepository.findAll()).thenReturn(List.of(testManager));
        
        // Act
        ProductManager loggedInUser = userService.login("testuser", "password123");
        
        // Assert
        assertNotNull(loggedInUser);
        assertEquals("user123", loggedInUser.getId());
    }

    @Test
    void testLogin_UserBlocked() {
        // Arrange
        testManager.setBlockStatus(true);
        when(userRepository.findAll()).thenReturn(List.of(testManager));
        
        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> {
            userService.login("testuser", "password123");
        });
    }

    @Test
    void testLogin_IncorrectPassword() {
        // Arrange
        when(userRepository.findAll()).thenReturn(List.of(testManager));
        
        // Act & Assert
        assertThrows(IncorrectPasswordException.class, () -> {
            userService.login("testuser", "wrongpassword");
        });
    }

    // --- Product Management Tests ---

    @Test
    void testAddBook_Success() {
        // Arrange
        when(userRepository.findById("user123")).thenReturn(Optional.of(testManager));
        when(bookRepository.save(any(Book.class))).thenReturn(testBook);

        // Act
        Product savedProduct = userService.addBook("user123", testBook);

        // Assert
        assertNotNull(savedProduct);
        assertEquals("book456", savedProduct.getId());
        assertTrue(testManager.getOwnProductIds().contains("book456"));
        verify(userRepository, times(1)).save(testManager);
    }

    @Test
    void testUpdateBook_Success() {
        // Arrange
        Book updatedDetails = new Book();
        updatedDetails.setTitle("An Even Greater Book");
        updatedDetails.setPrice(150);

        when(bookRepository.findById("book456")).thenReturn(Optional.of(testBook));
        when(bookRepository.save(any(Book.class))).thenReturn(testBook); // Return the modified object

        // Act
        Book result = (Book) userService.updateBook("book456", updatedDetails);

        // Assert
        assertNotNull(result);
        assertEquals("An Even Greater Book", result.getTitle());
        assertEquals(150, result.getPrice());
        verify(bookRepository, times(1)).save(any(Book.class));
    }
    
    @Test
    void testUpdateBook_NotFound() {
        // Arrange
        when(bookRepository.findById("nonexistent-id")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ProductNotFoundException.class, () -> {
            userService.updateBook("nonexistent-id", new Book());
        });
    }

    // --- Bulk Deletion Tests ---
    
    @Test
    @Transactional
    void testDeleteListProduct_Success() {
        // Arrange
        List<String> idsToDelete = List.of("prod1", "prod2");
        Product prod1 = new Product();
        prod1.setId("prod1");
        Product prod2 = new Product();
        prod2.setId("prod2");
        List<Product> productsToDelete = List.of(prod1, prod2);
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
    
    @Test
    void testDeleteListProduct_RequestTooLarge() {
        // Arrange: Create a list with 11 IDs, assuming MAX_PRODUCTS_PER_REQUEST is 10
        List<String> idsToDelete = new ArrayList<>();
        for (int i = 0; i < 11; i++) idsToDelete.add("prod" + i);

        // Act & Assert
        assertThrows(ProductSizeException.class, () -> {
            userService.deleteListProduct("user123", idsToDelete);
        });
    }

    @Test
    void testDeleteListProduct_DailyLimitExceeded() {
        // Arrange: Trying to delete 3 products when only 2 are allowed for the rest of the day
        List<String> idsToDelete = List.of("prod1", "prod2", "prod3");
        when(userRepository.findById("user123")).thenReturn(Optional.of(testManager));
        // Assume DAILY_DELETE_LIMIT = 30, and user already deleted 28
        when(deletionLogRepository.countByManagerIdAndDeletedAtAfter(anyString(), any(LocalDateTime.class))).thenReturn(28L);

        // Act & Assert
        assertThrows(DailyDeleteLimitExceededException.class, () -> {
            userService.deleteListProduct("user123", idsToDelete);
        });
    }
}