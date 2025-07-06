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
import com.media_shop.exception.InvalidRequestException;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    private final ProductManagerRepository userRepository;
    private final ProductRepository productRepository;
    private final DeletionLogRepository deletionLogRepository;
    /**
     * [REFACTORED] This method updates common fields of a product.
     * It is used in the updateCD, updateBook, and updateDVD methods.
     */
    private void updateProductCommonFields(Product existingProduct, Product productDetails) {
        // CHÚ THÍCH: Bắt đầu phần xử lý và kiểm tra giá
        // Lấy giá mới từ dữ liệu người dùng gửi lên
        double newPrice = productDetails.getPrice();
        // Lấy giá cũ từ sản phẩm đã có trong database
        double oldPrice = existingProduct.getPrice();

        // Tính toán ngưỡng giá cho phép
        double minPrice = oldPrice * 0.3;
        double maxPrice = oldPrice * 1.5;

        // Kiểm tra nếu giá mới không nằm trong khoảng cho phép
        if (newPrice < minPrice || newPrice > maxPrice) {
            String message = String.format(
                "Giá mới phải nằm trong khoảng từ %.0f đến %.0f.",
                Math.ceil(minPrice),
                Math.floor(maxPrice)
            );
            // Ném ra lỗi để báo cho người dùng
            throw new InvalidRequestException(message);
        }
        // Kết thúc phần xử lý giá

        // Nếu giá hợp lệ, cập nhật tất cả các trường chung
        existingProduct.setTitle(productDetails.getTitle());
        existingProduct.setDescription(productDetails.getDescription());
        existingProduct.setPrice(newPrice); // Cập nhật giá mới đã được kiểm tra
        existingProduct.setQuantity(productDetails.getQuantity());
        existingProduct.setWeight(productDetails.getWeight());
        existingProduct.setImageURL(productDetails.getImageURL());
        existingProduct.setRushDeliverySupport(productDetails.isRushDeliverySupport());
    }

    // --- Define constants for your business rules ---
    private static final int DAILY_DELETE_LIMIT = 30;
    private static final int MAX_PRODUCTS_PER_REQUEST = 10;

    // --- Single, corrected constructor that initializes ALL repositories ---
    public UserServiceImpl(ProductManagerRepository userRepository,
                        ProductRepository productRepository, DeletionLogRepository deletionLogRepository) {
        this.userRepository = userRepository;
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
        CD savedCD = productRepository.save(product);

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
        Book savedBook = productRepository.save(product);

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
        DVD savedDVD = productRepository.save(product);

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
     *  using the "Find, Update, Save" pattern.
     * This prevents issues like 'productType' being null and is safe against concurrent updates.
     * It also ensures that the common fields of Product are updated correctly.
     */

    @Override
    public Product updateCD(String id, CD productDetails) {
        CD existingCD = (CD) productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("CD not found with id: " + id));

        // Gọi phương thức chung để cập nhật các trường của Product
        updateProductCommonFields(existingCD, productDetails);

        // Chỉ cập nhật các trường riêng của CD
        existingCD.setArtist(productDetails.getArtist());
        existingCD.setRecordLabel(productDetails.getRecordLabel());
        existingCD.setMusicType(productDetails.getMusicType());
        existingCD.setReleasedDate(productDetails.getReleasedDate());

        return productRepository.save(existingCD);
    }

    @Override
    public Product updateBook(String id, Book productDetails) {
        Book existingBook = (Book) productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Book not found with id: " + id));

        // Gọi phương thức chung để cập nhật các trường của Product
        updateProductCommonFields(existingBook, productDetails);

        // Chỉ cập nhật các trường riêng của Book
        existingBook.setAuthor(productDetails.getAuthor());
        existingBook.setPublisher(productDetails.getPublisher());
        existingBook.setCoverType(productDetails.getCoverType());
        existingBook.setLanguage(productDetails.getLanguage());
        existingBook.setPublishDate(productDetails.getPublishDate());
        existingBook.setNumOfPages(productDetails.getNumOfPages());
        existingBook.setBookCategory(productDetails.getBookCategory());
        
        return productRepository.save(existingBook);
    }

    @Override
    public Product updateDVD(String id, DVD productDetails) {
        DVD existingDVD = (DVD) productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("DVD not found with id: " + id));

        // Gọi phương thức chung để cập nhật các trường của Product
        updateProductCommonFields(existingDVD, productDetails);

        // Chỉ cập nhật các trường riêng của DVD
        existingDVD.setDirector(productDetails.getDirector());
        existingDVD.setSubtitles(productDetails.getSubtitles());
        existingDVD.setReleasedDate(productDetails.getReleasedDate());
        existingDVD.setLanguage(productDetails.getLanguage());
        existingDVD.setDiscType(productDetails.getDiscType());
        existingDVD.setDuration(productDetails.getDuration());
        existingDVD.setFilmType(productDetails.getFilmType());

        return productRepository.save(existingDVD);
    }
    @Override
    public Product updatePrice(String productId, int newPrice) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
        product.setPrice(newPrice);
        return productRepository.save(product);
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