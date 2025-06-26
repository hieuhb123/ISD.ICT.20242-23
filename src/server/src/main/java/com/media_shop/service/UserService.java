package com.media_shop.service;

import com.cloudinary.Cloudinary;
import com.media_shop.entity.product.Book;
import com.media_shop.entity.product.CD;
import com.media_shop.entity.product.DVD;
import com.media_shop.entity.product.Product;
import com.media_shop.entity.user.ProductManager;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public interface UserService {
    ProductManager createUser(String username, String password);
    void deleteUser(String userId);
    ProductManager changePassword(String userId, String currentPassword, String newPassword);
//    ProductManager updateUser(String id, ProductManager newUser);
    List<ProductManager> getAllProductManager();
    ProductManager login(String username, String password);

    Product addCD(String userId, CD product);
    Product addBook(String userId, Book product);
    Product addDVD(String userId, DVD product);

    Product updateCD(String id, CD product);
    Product updateBook(String id, Book product);
    Product updateDVD(String id, DVD product);

    void deleteProduct(String userId, String id);
    void deleteListProduct(String userId, List<String> ids);

    Product updatePrice(String productId, int newPrice);

    String getURLImage(Cloudinary cloudinary, MultipartFile image) throws IOException ;
    List<Product> getProductsByManager(String userId);
    Product getProductById(String id);
}
