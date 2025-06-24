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
        ProductManager existedUser = userRepository.findAll().stream()
                .filter(u -> u.getUsername().equals(username))
                .findFirst()
                .orElse(null);
        if (existedUser != null) {
            throw new UserExistedException("User existed in the system");
        } else {
            ProductManager user = new ProductManager();
            user.setUsername(username);
            user.setPassword(password);
            user.setBlockStatus(false);
            return userRepository.save(user);
        }
    }

    @Override
    public void deleteUser(String userId) {
        ProductManager user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            userRepository.delete(user);
        } else {
            throw new UserNotFoundException("User not found");
        }
    }

    @Override
    public ProductManager changePassword(String userId, String currentPassword, String newPassword) {
        ProductManager user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            if (user.getPassword().equals(currentPassword)) {
                user.setPassword(newPassword);
                return userRepository.save(user);
            } else {
                throw new IncorrectPasswordException("Incorrect password");
            }
        } else {
            throw new UserNotFoundException("User not found");
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
                .orElse(null);
        if (user != null) {
            if (user.getBlockStatus()) {
                throw new UserNotFoundException("User is blocked");
            }
            if (user.getPassword().equals(password)) {
                return user;
            } else {
                throw new IncorrectPasswordException("Incorrect password");
            }

        } else {
            throw new UserNotFoundException("User not found");
        }
    }


    
    @Override
    public Product addCD(String userId, CD product) {
        // Lưu CD vào database
        product.setProductType("cd");
        CD savedCD = cdRepository.save(product);

        // Lấy ProductManager
        ProductManager user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            // Thêm id sản phẩm vào danh sách sở hữu (nếu chưa có)
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
    public void deleteProduct(String userId, String id) {
        // Xóa sản phẩm khỏi collection product
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
        } else {
            throw new ProductNotFoundException("Product not found");
        }

        // Xóa id sản phẩm khỏi danh sách sở hữu của ProductManager
        ProductManager user = userRepository.findById(userId).orElse(null);
        if (user != null && user.getOwnProductIds() != null) {
            user.getOwnProductIds().remove(id);
            userRepository.save(user);
        }
    }

    @Override
    public void deleteListProduct(String userId, List<String> ids) {
        if (ids.size() > 10)
            throw new ProductSizeException("Number of products to delete must be less than 10 at once.");
        for (String id : ids) {
            if (productRepository.existsById(id))
                productRepository.deleteById(id);
            else
                throw new ProductNotFoundException("Product not found");
        }

        // Xóa các id sản phẩm khỏi danh sách sở hữu của ProductManager
        ProductManager user = userRepository.findById(userId).orElse(null);
        if (user != null && user.getOwnProductIds() != null) {
            user.getOwnProductIds().removeAll(ids);
            userRepository.save(user);
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

    @Override
    public String getURLImage(Cloudinary cloudinary, MultipartFile image) throws IOException{
        @SuppressWarnings("rawtypes")
        Map uploadResult = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.emptyMap());
        String imageUrl = (String) uploadResult.get("secure_url");
        return imageUrl;
    }
    @Override
    public Product getProductById(String id) {
        return productRepository.findById(id).orElseThrow(() 
            -> new ProductNotFoundException("Product not found"));
    }

}
