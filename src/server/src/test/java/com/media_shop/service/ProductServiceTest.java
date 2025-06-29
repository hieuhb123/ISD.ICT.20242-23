package com.media_shop.service;

import com.media_shop.entity.product.Product;
import com.media_shop.entity.product.CD;
import com.media_shop.entity.product.Book;
import com.media_shop.entity.product.DVD;
import com.media_shop.repository.product.ProductRepository;
import com.media_shop.service.implementation.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private CD testCD;
    private Book testBook;
    private DVD testDVD;

    @BeforeEach
    void setUp() {
        testCD = new CD();
        testCD.setId("cd1");
        testCD.setTitle("Test Album");
        testCD.setDescription("Test CD Description");
        testCD.setPrice(25.99);
        testCD.setQuantity(10);
        testCD.setArtist("Test Artist");
        testCD.setRecordLabel("Test Label");
        testCD.setMusicType("Rock");
        testCD.setDeleted(false);

        // Create test Book
        testBook = new Book();
        testBook.setId("book1");
        testBook.setTitle("Test Book");
        testBook.setDescription("Test Book Description");
        testBook.setPrice(15.99);
        testBook.setQuantity(5);
        testBook.setAuthor("Test Author");
        testBook.setPublisher("Test Publisher");
        testBook.setNumOfPages(300);
        testBook.setLanguage("English");
        testBook.setDeleted(false);

        // Create test DVD
        testDVD = new DVD();
        testDVD.setId("dvd1");
        testDVD.setTitle("Test Movie");
        testDVD.setDescription("Test DVD Description");
        testDVD.setPrice(19.99);
        testDVD.setQuantity(8);
        testDVD.setDirector("Test Director");
        testDVD.setDuration("120 minutes");
        testDVD.setLanguage("English");
        testDVD.setSubtitles("English, Spanish");
        testDVD.setDeleted(false);
    }

    @Test
    void testViewAllProduct_Success() {
        // Arrange
        List<Product> expectedProducts = Arrays.asList(testCD, testBook, testDVD);
        when(productRepository.findAll()).thenReturn(expectedProducts);

        // Act
        List<Product> actualProducts = productService.viewAllProduct();

        // Assert
        assertNotNull(actualProducts);
        assertEquals(3, actualProducts.size());
        assertEquals(expectedProducts, actualProducts);
        verify(productRepository, times(1)).findAll();
    }

    @Test
    void testViewProduct_Success() {
        // Arrange
        String productId = "cd1";
        when(productRepository.findById(productId)).thenReturn(Optional.of(testCD));

        // Act
        Product actualProduct = productService.viewProduct(productId);

        // Assert
        assertNotNull(actualProduct);
        assertEquals(testCD.getId(), actualProduct.getId());
        assertEquals(testCD.getTitle(), actualProduct.getTitle());
        assertEquals(testCD.getPrice(), actualProduct.getPrice());
        assertEquals(testCD.getQuantity(), actualProduct.getQuantity());
        verify(productRepository, times(1)).findById(productId);
    }

    @Test
    void testViewProduct_NotFound() {
        // Arrange
        String productId = "nonexistent";
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            productService.viewProduct(productId);
        });
        verify(productRepository, times(1)).findById(productId);
    }

    @Test
    void testViewProduct_CDSpecificFields() {
        // Arrange
        String productId = "cd1";
        when(productRepository.findById(productId)).thenReturn(Optional.of(testCD));

        // Act
        Product actualProduct = productService.viewProduct(productId);

        // Assert
        assertTrue(actualProduct instanceof CD);
        CD actualCD = (CD) actualProduct;
        assertEquals(testCD.getArtist(), actualCD.getArtist());
        assertEquals(testCD.getRecordLabel(), actualCD.getRecordLabel());
        assertEquals(testCD.getMusicType(), actualCD.getMusicType());
    }

    @Test
    void testViewProduct_BookSpecificFields() {
        // Arrange
        String productId = "book1";
        when(productRepository.findById(productId)).thenReturn(Optional.of(testBook));

        // Act
        Product actualProduct = productService.viewProduct(productId);

        // Assert
        assertTrue(actualProduct instanceof Book);
        Book actualBook = (Book) actualProduct;
        assertEquals(testBook.getAuthor(), actualBook.getAuthor());
        assertEquals(testBook.getPublisher(), actualBook.getPublisher());
        assertEquals(testBook.getNumOfPages(), actualBook.getNumOfPages());
        assertEquals(testBook.getLanguage(), actualBook.getLanguage());
    }

    @Test
    void testViewProduct_DVDSpecificFields() {
        // Arrange
        String productId = "dvd1";
        when(productRepository.findById(productId)).thenReturn(Optional.of(testDVD));

        // Act
        Product actualProduct = productService.viewProduct(productId);

        // Assert
        assertTrue(actualProduct instanceof DVD);
        DVD actualDVD = (DVD) actualProduct;
        assertEquals(testDVD.getDirector(), actualDVD.getDirector());
        assertEquals(testDVD.getDuration(), actualDVD.getDuration());
        assertEquals(testDVD.getSubtitles(), actualDVD.getSubtitles());
    }
}
