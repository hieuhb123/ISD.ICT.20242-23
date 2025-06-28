package com.media_shop.service.implementation;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.media_shop.entity.product.*;
import com.media_shop.repository.product.*;
import com.media_shop.entity.user.ProductManager;
import com.media_shop.exception.*; // Import all exceptions from the package
import com.media_shop.repository.user.ProductManagerRepository;
import com.media_shop.service.UserService;
import com.media_shop.repository.user.DeletionLogRepository;
import com.media_shop.entity.user.DeletionLog;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.media_shop.utils.Constants;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    private final ProductManagerRepository userRepository;
    private final CDRepository cdRepository;
    private final DVDRepository dvdRepository;
    private final BookRepository bookRepository;
    private final ProductRepository productRepository;
    private final DeletionLogRepository deletionLogRepository;

    // --- Define constants for your business rules ---
    private static final int DAILY_DELETE_LIMIT = 30;
    private static final int MAX_PRODUCTS_PER_REQUEST = 10;

    // --- Single, corrected constructor that initializes ALL repositories ---
    public UserServiceImpl(ProductManagerRepository userRepository, CDRepository cdRepository,
                        DVDRepository dvdRepository, BookRepository bookRepository,
                        ProductRepository productRepository, DeletionLogRepository deletionLogRepository) {
        this.userRepository = userRepository;
        this.cdRepository = cdRepository;
        this.dvdRepository = dvdRepository;
        this.bookRepository = bookRepository;
        this.productRepository = productRepository;
        this.deletionLogRepository = deletionLogRepository;
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
            user.setPassword(password);
            user.setBlockStatus(false);
            user.setCreatedAt(Instant.now());
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
    @Transactional
    public void deleteListProduct(String userId, List<String> idsToDelete) {
        // REQUIREMENT 1: Check the size of the incoming request first
        if (idsToDelete.size() > MAX_PRODUCTS_PER_REQUEST) {
            throw new ProductSizeException("You can only delete a maximum of " + MAX_PRODUCTS_PER_REQUEST + " products at a time.");
        }

        // Find the user
        ProductManager manager = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Product Manager not found"));

        // REQUIREMENT 2: Check the daily delete limit
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        long alreadyDeletedCount = deletionLogRepository.countByManagerIdAndDeletedAtAfter(manager.getId(), startOfToday);

        if (alreadyDeletedCount + idsToDelete.size() > DAILY_DELETE_LIMIT) {
            long remainingDeletes = DAILY_DELETE_LIMIT - alreadyDeletedCount;
            throw new DailyDeleteLimitExceededException(
                "Daily delete limit exceeded. You have already deleted " + alreadyDeletedCount +
                " products today. You can only delete " + (remainingDeletes > 0 ? remainingDeletes : 0) + " more."
            );
        }

        // If all checks pass, proceed with the deletion
        List<Product> productsToDelete = productRepository.findAllById(idsToDelete);
        if (productsToDelete.size() != idsToDelete.size()) {
            throw new ProductNotFoundException("One or more products not found");
        }
        
        // Soft delete the products
        productsToDelete.forEach(product -> product.setDeleted(true));
        productRepository.saveAll(productsToDelete);

        // Log the successful deletions
        List<DeletionLog> logs = idsToDelete.stream()
                                            .map(productId -> new DeletionLog(manager.getId()))
                                            .collect(Collectors.toList());
        deletionLogRepository.saveAll(logs);

        // Update the manager's own product list
        if (manager.getOwnProductIds() != null) {
            manager.getOwnProductIds().removeAll(idsToDelete);
            userRepository.save(manager);
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
    public List<Product> getProductsByManager(String userId) {
        ProductManager manager = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Product Manager not found"));
        
        if (manager.getOwnProductIds() == null || manager.getOwnProductIds().isEmpty()) {
            return new ArrayList<>();
        }
        
        return productRepository.findAllById(manager.getOwnProductIds());
    }

    @Override
    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
    }

    @Override
    public ProductManager blockUser(String userId) {
        ProductManager user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        user.setBlockStatus(true);
        return userRepository.save(user);
    }

    @Override
    public ProductManager unblockUser(String userId) {
        ProductManager user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        user.setBlockStatus(false);
        return userRepository.save(user);
    }
}