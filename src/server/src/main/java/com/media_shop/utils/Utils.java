package com.aims.utils;

import com.aims.entity.order.Order;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.DateFormat;
import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.logging.Logger;


public class Utils {


    public static String convertPaymentTimeFormat(String input) {
        try {
            // Định dạng của đầu vào
            SimpleDateFormat inputFormat = new SimpleDateFormat("yyyyMMddHHmmss");
            // Định dạng của đầu ra
            SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");

            // Chuyển đổi từ chuỗi sang đối tượng Date
            Date date = inputFormat.parse(input);

            // Chuyển đổi từ Date sang chuỗi theo định dạng mong muốn
            return outputFormat.format(date);
        } catch (ParseException e) {
            // Xử lý nếu có lỗi khi chuyển đổi
            System.err.println("Error converting date: " + e.getMessage());
            return null; // hoặc giá trị mặc định khác tùy ý
        }
    }
    public static String convertDateFormat(String inputDate) {
        try {
            // Định dạng của chuỗi ngày giờ đầu vào
            SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");

            // Định dạng của chuỗi ngày giờ đầu ra
            SimpleDateFormat outputFormat = new SimpleDateFormat("yyyyMMddHHmmss");

            // Chuyển đổi chuỗi ngày giờ thành đối tượng Date
            Date date = inputFormat.parse(inputDate);

            // Chuyển đổi đối tượng Date thành chuỗi ngày giờ theo định dạng mới
            return outputFormat.format(date);
        } catch (ParseException e) {
            e.printStackTrace(); // Xử lý lỗi theo yêu cầu của bạn
            return null;
        }
    }

}