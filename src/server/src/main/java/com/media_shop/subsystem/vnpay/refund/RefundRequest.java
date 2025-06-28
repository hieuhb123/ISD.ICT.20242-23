package com.media_shop.subsystem.vnpay.refund;



import com.google.gson.JsonObject;
import com.media_shop.entity.order.Order;
import com.media_shop.entity.payment.PaymentTransaction;
import com.media_shop.repository.order.OrderRepository;
import com.media_shop.subsystem.vnpay.config.VNPayConfig;
import com.media_shop.utils.Constants;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.TimeZone;

public class RefundRequest {
    private final PaymentTransaction paymentTransaction;
    private final OrderRepository orderRepository;

    public RefundRequest(PaymentTransaction paymentTransaction, OrderRepository orderRepository) {
        this.paymentTransaction = paymentTransaction;
        this.orderRepository = orderRepository; 
    }

    public String refund() throws IOException {

        //Command: refund
        String vnp_RequestId = VNPayConfig.getRandomNumber(8);
        String vnp_Version = VNPayConfig.vnp_Version;
        String vnp_Command = VNPayConfig.vnp_Command_refund;
        String vnp_TmnCode = VNPayConfig.vnp_TmnCode;
        String vnp_TransactionType = "02";
        String vnp_TxnRef = paymentTransaction.getOrderId();
        long amount = paymentTransaction.getVnp_Amount() * 100L;
        String vnp_Amount = String.valueOf(amount);
        String vnp_OrderInfo = "Hoan tien GD OrderId:" + vnp_TxnRef;
        String vnp_TransactionNo =  paymentTransaction.getVnp_TransactionNo();
        String vnp_TransactionDate  = paymentTransaction.getVnp_PayDate();
        String vnp_CreateBy = VNPayConfig.website_name;

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        String vnp_IpAddr = VNPayConfig.getIpAddress();

        JsonObject vnp_Params = new JsonObject ();
        vnp_Params.addProperty("vnp_RequestId", vnp_RequestId);
        vnp_Params.addProperty("vnp_Version", vnp_Version);
        vnp_Params.addProperty("vnp_Command", vnp_Command);
        vnp_Params.addProperty("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.addProperty("vnp_TransactionType", vnp_TransactionType);
        vnp_Params.addProperty("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.addProperty("vnp_Amount", vnp_Amount);
        vnp_Params.addProperty("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.addProperty("vnp_TransactionNo", vnp_TransactionNo);
        vnp_Params.addProperty("vnp_TransactionDate", vnp_TransactionDate);
        vnp_Params.addProperty("vnp_CreateBy", vnp_CreateBy);
        vnp_Params.addProperty("vnp_CreateDate", vnp_CreateDate);
        vnp_Params.addProperty("vnp_IpAddr", vnp_IpAddr);

        String hash_Data= String.join("|", vnp_RequestId, vnp_Version, vnp_Command, vnp_TmnCode,
                vnp_TransactionType, vnp_TxnRef, vnp_Amount, vnp_TransactionNo, vnp_TransactionDate,
                vnp_CreateBy, vnp_CreateDate, vnp_IpAddr, vnp_OrderInfo);

        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.secretKey, hash_Data);

        vnp_Params.addProperty("vnp_SecureHash", vnp_SecureHash);

        URL url = new URL(VNPayConfig.vnp_ApiUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);
        DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
        wr.writeBytes(vnp_Params.toString());
        wr.flush();
        wr.close();
        int responseCode = connection.getResponseCode();
        System.out.println("nSending 'POST' request to URL : " + url);
        System.out.println("Post Data : " + vnp_Params);
        System.out.println("Response Code : " + responseCode);
        BufferedReader in = new BufferedReader(
                new InputStreamReader(connection.getInputStream()));
        String output;
        StringBuffer response = new StringBuffer();
        while ((output = in.readLine()) != null) {
            response.append(output);
        }
        in.close();

        JsonObject jsonResponse = com.google.gson.JsonParser.parseString(response.toString()).getAsJsonObject();
        String res_vnp_TxnRef = jsonResponse.get("vnp_TxnRef").getAsString();
        String vnp_ResponseCode = jsonResponse.get("vnp_ResponseCode").getAsString();
        Order order = orderRepository.findById(res_vnp_TxnRef)
            .orElseThrow(() -> new RuntimeException("Order not found: " + res_vnp_TxnRef));
        if ("00".equals(vnp_ResponseCode)) {
            order.setStatus(Constants.ORDER_STATUS_CANCELLED);
            orderRepository.save(order);
        }
        return response.toString();
    }

}
