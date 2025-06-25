package com.media_shop.service.implementation;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.media_shop.entity.product.*;
import com.media_shop.repository.product.*;
import com.media_shop.entity.user.ProductManager;
import com.media_shop.exception.IncorrectPasswordException;
import com.media_shop.exception.ProductNotFoundException;
import com.media_shop.exception.ProductSizeException;
import com.media_shop.exception.UserExistedException;
import com.media_shop.exception.UserNotFoundException;
import com.media_shop.repository.user.ProductManagerRepository;
import com.media_shop.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.media_shop.utils.Constants;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {
    private final ProductManagerRepository userRepository;
    private final CDRepository cdRepository;
    private final DVDRepository dvdRepository;
    private final BookRepository bookRepository;
    private final ProductRepository productRepository;

    public UserServiceImpl(ProductManagerRepository userRepository, CDRepository cdRepository,
                           DVDRepository dvdRepository, BookRepository bookRepository, ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.cdRepository = cdRepository;
        this.dvdRepository = dvdRepository;
        this.bookRepository = bookRepository;
        this.productRepository = productRepository;
    }

    @Override
    public ProductManager createUser(String username, String password) {
        userRepository.findAll().stream()
                .filter(u -> u.getUsername().equals(username))
                .findFirst()
                .ifPresent(u -> {
                    throw new UserExistedException("User existed in the system");
                });

        ProductManager user = new ProductManager();
        user.setUsername(username);
        user.setPassword(password); // Note: In a real app, you should hash the password
        user.setBlockStatus(false);
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(String userId) {
        ProductManager user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        userRepository.delete(user);
    }

    @Override
    public ProductManager changePassword(String userId, String currentPassword, String newPassword) {
        ProductManager user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (user.getPassword().equals(currentPassword)) {
            user.setPassword(newPassword); // Again, hash the new password
            return userRepository.save(user);
        } else {
            throw new IncorrectPasswordException("Incorrect password");
        }
    }

    @Override
    public List<ProductManager> getAllProductManager() {
        return userRepository.findAll();
    }

    @Override
    public ProductManager login(String username, String password) {
        ProductManager user = userRepository.findAll().stream()
                .filter(u -> u.getUsername().equals(username))
                .findFirst()
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (user.getBlockStatus()) {
            throw new UserNotFoundException("User is blocked");
        }

        if (user.getPassword().equals(password)) {
            return user;
        } else {
            throw new IncorrectPasswordException("Incorrect password");
        }
    }

    @Override
    public Product addCD(String userId, CD product) {
        product.setProductType("cd");
        CD savedCD = cdRepository.save(product);

        ProductManager user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            if (user.getOwnProductIds() == null) {
                user.setOwnProductIds(new ArrayList<>());
            }
            user.getOwnProductIds().add(savedCD.getId());
            userRepository.save(user);
        }
        return savedCD;
    }

    @Override
    public Product addBook(String userId, Book product) {
        product.setProductType("book");
        Book savedBook = bookRepository.save(product);

        ProductManager user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            if (user.getOwnProductIds() == null) {
                user.setOwnProductIds(new ArrayList<>());
            }
            user.getOwnProductIds().add(savedBook.getId());
            userRepository.save(user);
        }
        return savedBook;
    }

    @Override
    public Product addDVD(String userId, DVD product) {
        product.setProductType("dvd");
        DVD savedDVD = dvdRepository.save(product);

        ProductManager user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            if (user.getOwnProductIds() == null) {
                user.setOwnProductIds(new ArrayList<>());
            }
            user.getOwnProductIds().add(savedDVD.getId());
            userRepository.save(user);
        }
        return savedDVD;
    }

    /**
     * [REFACTORED] Updated using the "Find, Update, Save" pattern.
     * This prevents issues like 'productType' being null and is safer.
     */
    @Override
    public Product updateCD(String id, CD productDetails) {
        CD existingCD = cdRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("CD not found with id: " + id));

        // Các trường chung từ lớp Product
        existingCD.setTitle(productDetails.getTitle());
        existingCD.setDescription(productDetails.getDescription());
        existingCD.setPrice(productDetails.getPrice());
        existingCD.setQuantity(productDetails.getQuantity());
        existingCD.setWeight(productDetails.getWeight());
        existingCD.setImageURL(productDetails.getImageURL());
        existingCD.setRushDeliverySupport(productDetails.isRushDeliverySupport());
        
        // Các trường riêng của CD (đã đúng)
        existingCD.setArtist(productDetails.getArtist());
        existingCD.setRecordLabel(productDetails.getRecordLabel());
        existingCD.setMusicType(productDetails.getMusicType());
        existingCD.setReleasedDate(productDetails.getReleasedDate());

        return cdRepository.save(existingCD);
    }

    @Override
    public Product updateBook(String id, Book productDetails) {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Book not found with id: " + id));
        
        // Các trường chung từ lớp Product
        existingBook.setTitle(productDetails.getTitle());
        existingBook.setDescription(productDetails.getDescription());
        existingBook.setPrice(productDetails.getPrice());
        existingBook.setQuantity(productDetails.getQuantity());
        existingBook.setWeight(productDetails.getWeight());
        existingBook.setImageURL(productDetails.getImageURL());
        existingBook.setRushDeliverySupport(productDetails.isRushDeliverySupport());
        
        // Các trường riêng của Book (đã được chỉnh lại cho đúng entity)
        existingBook.setAuthor(productDetails.getAuthor());
        existingBook.setPublisher(productDetails.getPublisher());
        existingBook.setCoverType(productDetails.getCoverType());
        existingBook.setLanguage(productDetails.getLanguage()); //  <-- THÊM LẠI
        existingBook.setPublishDate(productDetails.getPublishDate()); // <-- SỬA LẠI
        existingBook.setNumOfPages(productDetails.getNumOfPages());   // <-- SỬA LẠI
        existingBook.setBookCategory(productDetails.getBookCategory()); // <-- THÊM LẠI
        
        return bookRepository.save(existingBook);
    }

    @Override
    public Product updateDVD(String id, DVD productDetails) {
        DVD existingDVD = dvdRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("DVD not found with id: " + id));

        // Các trường chung từ lớp Product
        existingDVD.setTitle(productDetails.getTitle());
        existingDVD.setDescription(productDetails.getDescription());
        existingDVD.setPrice(productDetails.getPrice());
        existingDVD.setQuantity(productDetails.getQuantity());
        existingDVD.setWeight(productDetails.getWeight());
        existingDVD.setImageURL(productDetails.getImageURL());
        existingDVD.setRushDeliverySupport(productDetails.isRushDeliverySupport());
        
        // Các trường riêng của DVD (đã được chỉnh lại cho đúng entity)
        existingDVD.setDirector(productDetails.getDirector());
        existingDVD.setSubtitles(productDetails.getSubtitles());
        existingDVD.setReleasedDate(productDetails.getReleasedDate());
        existingDVD.setLanguage(productDetails.getLanguage()); // <-- THÊM LẠI
        existingDVD.setDiscType(productDetails.getDiscType()); // <-- SỬA LẠI
        existingDVD.setDuration(productDetails.getDuration()); // <-- SỬA LẠI
        existingDVD.setFilmType(productDetails.getFilmType()); // <-- SỬA LẠI

        return dvdRepository.save(existingDVD);
    }

    @Override
    public void deleteProduct(String userId, String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
        
        product.setDeleted(true);
        productRepository.save(product);

        ProductManager user = userRepository.findById(userId).orElse(null);
        if (user != null && user.getOwnProductIds() != null) {
            user.getOwnProductIds().remove(id);
            userRepository.save(user);
        }
    }

    @Override
    public void deleteListProduct(String userId, List<String> ids) {
        if (ids.size() > 10) {
            throw new ProductSizeException("Number of products to delete must be less than 10 at once.");
        }
        
        List<Product> productsToDelete = productRepository.findAllById(ids);
        if(productsToDelete.size() != ids.size()){
            throw new ProductNotFoundException("One or more products not found");
        }
        
        // Soft delete: đặt deleted = true cho tất cả sản phẩm thay vì xóa hoàn toàn
        productsToDelete.forEach(product -> product.setDeleted(true));
        productRepository.saveAll(productsToDelete);

        ProductManager user = userRepository.findById(userId).orElse(null);
        if (user != null && user.getOwnProductIds() != null) {
            user.getOwnProductIds().removeAll(ids);
            userRepository.save(user);
        }
    }

    @Override
    public Product updatePrice(String productId, int newPrice) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
        product.setPrice(newPrice);
        return productRepository.save(product);
    }

    @Override
    public String getURLImage(Cloudinary cloudinary, MultipartFile image) throws IOException {
        @SuppressWarnings("rawtypes")
        Map uploadResult = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.emptyMap());
        return (String) uploadResult.get("secure_url");
    }

    @Override
    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
    }
}