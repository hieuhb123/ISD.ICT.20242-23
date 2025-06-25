package com.media_shop.entity.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "product")
public class DVD extends Product {
    private String discType;
    private String director;
    private String duration;
    private String language;
    private String subtitles;
    private Date releasedDate;
    private String filmType;
}