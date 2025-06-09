package com.media_shop.service.implementation;

import com.media_shop.entity.product.Book;
import com.media_shop.entity.product.CD;
import com.media_shop.entity.product.DVD;
import com.media_shop.entity.product.Product;
import com.media_shop.exception.ProductSizeException;
import com.media_shop.exception.ProductNotFoundException;
import com.media_shop.repository.product.BookRepository;
import com.media_shop.repository.product.CDRepository;
import com.media_shop.repository.product.DVDRepository;
import com.media_shop.repository.product.ProductRepository;
import com.media_shop.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CDRepository cdRepository;
    private final DVDRepository dvdRepository;
    private final BookRepository bookRepository;
    public ProductServiceImpl(ProductRepository productRepository, CDRepository cdRepository,
                              DVDRepository dvdRepository, BookRepository bookRepository) {
        this.productRepository = productRepository;
        this.cdRepository = cdRepository;
        this.dvdRepository = dvdRepository;
        this.bookRepository = bookRepository;
    }
    @Override
    public List<Product> viewAllProduct() {
        return productRepository.findAll();
    }

    @Override
    public Product viewProduct(String id){
        Product product = productRepository.findById(id).orElse(null);
        if (product != null) {
            return product;
        } else {
            throw new ProductNotFoundException("Product not found");
        }
    }



    @Override
    public Product addCD(CD product){
        return cdRepository.save(product);
    }

    @Override
    public Product addBook(Book product){
        return bookRepository.save(product);
    }

    @Override
    public Product addDVD(DVD product){
        return dvdRepository.save(product);
    }


    @Override
    public Product updateCD(String id, CD product){
        CD product1 = cdRepository.findById(id).orElse(null);
        if (product1 != null) {
            cdRepository.delete(product1);
            return cdRepository.save(product);
        } else {
            throw new ProductNotFoundException("Product not found");
        }
    }

    @Override
    public Product updateBook(String id, Book product){
        Book product1 = bookRepository.findById(id).orElse(null);
        if (product1 != null) {
            bookRepository.delete(product1);
            return bookRepository.save(product);
        } else {
            throw new ProductNotFoundException("Product not found");
        }
    }

    @Override
    public Product updateDVD(String id, DVD product){
        DVD product1 = dvdRepository.findById(id).orElse(null);
        if (product1 != null) {
            dvdRepository.delete(product1);
            return dvdRepository.save(product);
        } else {
            throw new ProductNotFoundException("Product not found");
        }
    }

    @Override
    public void deleteProduct(String id) {
        if (productRepository.existsById(id))
            productRepository.deleteById(id);
        else throw new ProductNotFoundException("Product not found");
    }

    @Override
    public void deleteListProduct(List<String> ids) {
        if (ids.size() > 10)
            throw new ProductSizeException("Number of products to delete must be less than 10 at once.");
        for (String id : ids) {
            if (productRepository.existsById(id))
                productRepository.deleteById(id);
            else throw new ProductNotFoundException("Product not found");
        }
    }

    @Override
    public Product updatePrice(String productId, int newPrice) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product != null) {
            product.setPrice(newPrice);
            return productRepository.save(product);
        } else {
            throw new ProductNotFoundException("Product not found");
        }
    }


}
