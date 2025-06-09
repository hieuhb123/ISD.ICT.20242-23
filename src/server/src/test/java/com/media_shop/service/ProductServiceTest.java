package com.media_shop.service;

import com.media_shop.entity.product.Book;
import com.media_shop.entity.product.CD;
import com.media_shop.entity.product.DVD;
import com.media_shop.entity.product.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceTest {

    private ProductService productService;

    private Book book;
    private CD cd;
    private DVD dvd;
    private Product product;

    @BeforeEach
    void setUp() {
        productService = mock(ProductService.class);

        book = new Book();
        book.setId("book1");
        book.setTitle("Test Book");

        cd = new CD();
        cd.setId("cd1");
        cd.setTitle("Test CD");

        dvd = new DVD();
        dvd.setId("dvd1");
        dvd.setTitle("Test DVD");

        product = new Product();
        product.setId("prod1");
        product.setTitle("Generic Product");
    }

    @Test
    void testViewAllProduct() {
        List<Product> result = productService.viewAllProduct();
        System.out.println(result);
    }

    @Test
    void testViewProduct() {
        when(productService.viewProduct("book1")).thenReturn(book);

        Product result = productService.viewProduct("book1");
        assertEquals("book1", result.getId());
        assertEquals("Test Book", result.getTitle());
    }

    @Test
    void testAddCD() {
        when(productService.addCD(cd)).thenReturn(cd);

        Product result = productService.addCD(cd);
        assertEquals("cd1", result.getId());
        assertEquals("Test CD", result.getTitle());
    }

    @Test
    void testAddBook() {
        when(productService.addBook(book)).thenReturn(book);

        Product result = productService.addBook(book);
        assertEquals("book1", result.getId());
        assertEquals("Test Book", result.getTitle());
    }

    @Test
    void testAddDVD() {
        when(productService.addDVD(dvd)).thenReturn(dvd);

        Product result = productService.addDVD(dvd);
        assertEquals("dvd1", result.getId());
        assertEquals("Test DVD", result.getTitle());
    }

    @Test
    void testUpdateCD() {
        CD updatedCD = new CD();
        updatedCD.setId("cd1");
        updatedCD.setTitle("Updated CD");
        when(productService.updateCD(eq("cd1"), any(CD.class))).thenReturn(updatedCD);

        Product result = productService.updateCD("cd1", updatedCD);
        assertEquals("cd1", result.getId());
        assertEquals("Updated CD", result.getTitle());
    }

    @Test
    void testUpdateBook() {
        Book updatedBook = new Book();
        updatedBook.setId("book1");
        updatedBook.setTitle("Updated Book");
        when(productService.updateBook(eq("book1"), any(Book.class))).thenReturn(updatedBook);

        Product result = productService.updateBook("book1", updatedBook);
        assertEquals("book1", result.getId());
        assertEquals("Updated Book", result.getTitle());
    }

    @Test
    void testUpdateDVD() {
        DVD updatedDVD = new DVD();
        updatedDVD.setId("dvd1");
        updatedDVD.setTitle("Updated DVD");
        when(productService.updateDVD(eq("dvd1"), any(DVD.class))).thenReturn(updatedDVD);

        Product result = productService.updateDVD("dvd1", updatedDVD);
        assertEquals("dvd1", result.getId());
        assertEquals("Updated DVD", result.getTitle());
    }

    @Test
    void testDeleteProduct() {
        doNothing().when(productService).deleteProduct("prod1");
        productService.deleteProduct("prod1");
        verify(productService, times(1)).deleteProduct("prod1");
    }

    @Test
    void testDeleteListProduct() {
        List<String> ids = Arrays.asList("prod1", "prod2");
        doNothing().when(productService).deleteListProduct(ids);
        productService.deleteListProduct(ids);
        verify(productService, times(1)).deleteListProduct(ids);
    }

    @Test
    void testUpdatePrice() {
        Product updatedProduct = new Product();
        updatedProduct.setId("prod1");
        updatedProduct.setTitle("Generic Product");
        updatedProduct.setPrice(200);

        when(productService.updatePrice("prod1", 200)).thenReturn(updatedProduct);

        Product result = productService.updatePrice("prod1", 200);
        assertEquals(200, result.getPrice());
    }
}