package com.media_shop.entity.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "product")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class DVD extends Product {
    String discType;
    String director;
    String duration;
    String language;
    String subtitles;
    Date releasedDate;
    String filmType;
}
