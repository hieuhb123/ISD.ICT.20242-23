package com.media_shop.Controller;

import com.media_shop.entity.Product;
import com.media_shop.exception.ProductNotFoundException;
import com.media_shop.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


class ProductControllerTest {

    private ProductController productController;
    private ProductRepository productRepo;

    @BeforeEach
    void setup() {
        productRepo = Mockito.mock(ProductRepository.class);
        productController = new ProductController(productRepo);
    }

    @Test
    void testViewExistingProduct() {
        Product product = new Product(1, "DVD Movie", 20.0);
        when(productRepo.findById(1)).thenReturn(Optional.of(product));

        Product result = productController.viewProduct(1);
        assertEquals("DVD Movie", result.getName());
        assertEquals(20.0, result.getPrice(), 0.0001);
    }

    @Test
    void testViewNonExistentProduct() {
        when(productRepo.findById(999)).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class, () -> {
            productController.viewProduct(999);
        });
    }

    @Test
    void testViewWithNullId() {
        assertThrows(IllegalArgumentException.class, () -> {
            productController.viewProduct(null);
        });
    }
}

