package com.media_shop.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * This annotation tells Spring to automatically return a 429 Too Many Requests
 * HTTP status whenever this exception is thrown and not caught by a more
 * specific handler. This simplifies the controller logic.
 */
@ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
public class DailyDeleteLimitExceededException extends RuntimeException {

    public DailyDeleteLimitExceededException(String message) {
        // Pass the message to the parent RuntimeException class
        super(message);
    }
}