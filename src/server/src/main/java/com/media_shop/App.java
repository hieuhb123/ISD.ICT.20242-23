package com.media_shop;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.config.EnableReactiveMongoAuditing;


@SpringBootApplication
@EnableMongoAuditing // Enables auditing features for MongoDB, such as automatic timestamping of documents
@EnableReactiveMongoAuditing
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}