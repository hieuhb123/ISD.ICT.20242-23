// In your com.media_shop.entity.user package
package com.media_shop.entity.user;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "delete_log") // Binds this class to the "delete_log" collection
@Data
@NoArgsConstructor
public class DeletionLog {

    @Id
    private String id; // MongoDB IDs are typically Strings

    private String managerId; // We store the ID of the ProductManager, not the whole object

    @CreatedDate // Automatically set the creation timestamp
    private LocalDateTime deletedAt;

    public DeletionLog(String managerId) {
        this.managerId = managerId;
    }
}