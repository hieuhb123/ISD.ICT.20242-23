import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function getParam(name: string) {
    return new URLSearchParams(window.location.search).get(name) || '';
}

const VNPayReturn: React.FC = () => {
    const navigate = useNavigate();
    const vnp_TxnRef = getParam('vnp_TxnRef');
    const vnp_Amount = getParam('vnp_Amount');
    const vnp_OrderInfo = getParam('vnp_OrderInfo');
    const vnp_ResponseCode = getParam('vnp_ResponseCode');
    const vnp_TransactionNo = getParam('vnp_TransactionNo');
    const vnp_BankCode = getParam('vnp_BankCode');
    const vnp_PayDate = getParam('vnp_PayDate');
    const vnp_TransactionStatus = getParam('vnp_TransactionStatus');
    
    const [status, setStatus] = useState<string>("Đang xử lý...");

    const processPayment = useCallback(async () => {
        const vnp_Params = {
            vnp_TxnRef,
            vnp_Amount,
            vnp_OrderInfo,
            vnp_ResponseCode,
            vnp_TransactionNo,
            vnp_TransactionStatus,
            vnp_BankCode,
            vnp_PayDate,
        };
        
        try {
            const res = await fetch('http://localhost:8080/api/payment/pay_return', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vnp_Params),
            });
            
            const data = await res.json();
            
            if (vnp_ResponseCode === "00") {
                setStatus("Thành công");
            } else {
                setStatus("Thất bại");
            }
            
            console.log('Kết quả lưu giao dịch:', data);
        } catch (err) {
            setStatus("Lỗi kết nối");
            console.error('Lỗi gửi dữ liệu pay_return:', err);
        }
    }, [vnp_TxnRef, vnp_Amount, vnp_OrderInfo, vnp_ResponseCode, vnp_TransactionNo, vnp_TransactionStatus, vnp_BankCode, vnp_PayDate]);

    useEffect(() => {
        processPayment();
    }, [processPayment]);

    const formatAmount = (amount: string) => {
        return (Number(amount) / 100).toLocaleString('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        });
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        // VNPay date format: yyyyMMddHHmmss
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        const hour = dateString.substring(8, 10);
        const minute = dateString.substring(10, 12);
        const second = dateString.substring(12, 14);
        
        const date = new Date(
            Number(year),
            Number(month) - 1, // months are 0-based
            Number(day),
            Number(hour),
            Number(minute),
            Number(second)
        );
        
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const getStatusBadge = () => {
        if (status === "Đang xử lý...") return "bg-warning";
        return vnp_ResponseCode === "00" ? "bg-success" : "bg-danger";
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white text-center py-3">
                            <h4 className="mb-0">Kết Quả Thanh Toán</h4>
                        </div>
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <span className={`badge ${getStatusBadge()} fs-5 px-4 py-2`}>
                                    {status}
                                </span>
                            </div>

                            <div className="row mb-3 border-bottom pb-3">
                                <div className="col-md-5 fw-bold">Mã giao dịch:</div>
                                <div className="col-md-7">{vnp_TxnRef}</div>
                            </div>

                            <div className="row mb-3 border-bottom pb-3">
                                <div className="col-md-5 fw-bold">Số tiền:</div>
                                <div className="col-md-7 fs-5 text-primary">
                                    {formatAmount(vnp_Amount)}
                                </div>
                            </div>

                            <div className="row mb-3 border-bottom pb-3">
                                <div className="col-md-5 fw-bold">Nội dung:</div>
                                <div className="col-md-7">{vnp_OrderInfo}</div>
                            </div>

                            <div className="row mb-3 border-bottom pb-3">
                                <div className="col-md-5 fw-bold">Ngân hàng:</div>
                                <div className="col-md-7">{vnp_BankCode}</div>
                            </div>

                            <div className="row mb-3 border-bottom pb-3">
                                <div className="col-md-5 fw-bold">Thời gian:</div>
                                <div className="col-md-7">
                                    {formatDate(vnp_PayDate)}
                                </div>
                            </div>

                            <div className="text-center mt-4">
                                <button 
                                    className="btn btn-primary me-2"
                                    onClick={() => navigate('/vieworder')}
                                >
                                    Xem đơn hàng
                                </button>
                                <button 
                                    className="btn btn-outline-primary"
                                    onClick={() => navigate('/')}
                                >
                                    Về trang chủ
                                </button>
                            </div>
                        </div>
                        <div className="card-footer text-center text-muted">
                            <small>&copy; {new Date().getFullYear()} VNPAY</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VNPayReturn;