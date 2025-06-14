import React, { useEffect, useState } from 'react';

function getParam(name: string) {
    return new URLSearchParams(window.location.search).get(name) || '';
}

const VNPayReturn: React.FC = () => {
    const vnp_TxnRef = getParam('vnp_TxnRef');
    const vnp_Amount = getParam('vnp_Amount');
    const vnp_OrderInfo = getParam('vnp_OrderInfo');
    const vnp_ResponseCode = getParam('vnp_ResponseCode');
    const vnp_TransactionNo = getParam('vnp_TransactionNo');
    const vnp_BankCode = getParam('vnp_BankCode');
    const vnp_PayDate = getParam('vnp_PayDate');
    const vnp_TransactionStatus = getParam('vnp_TransactionStatus');
    
    useEffect(() => {
        const res = fetch("http://localhost:8080/api/payment/save-payment-transaction", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: localStorage.getItem('userId'),
                orderId: vnp_TxnRef,
                vnp_TxnRef: vnp_TxnRef,
                vnp_Amount: vnp_Amount,
                vnp_OrderInfo: vnp_OrderInfo,
                vnp_ResponseCode: vnp_ResponseCode,
                vnp_TransactionNo: vnp_TransactionNo,
                vnp_BankCode: vnp_BankCode,
                vnp_PayDate: vnp_PayDate,
                vnp_TransactionStatus: vnp_TransactionStatus
            }),
        });
    }, []);
    let status = '';
    if (vnp_TransactionStatus === '00') {
        status = 'Thành công';
    } else {
        status = 'Không thành công';
    }

    return (
        <div className="container py-4">
            <div className="header clearfix">
                <h3 className="text-muted">KẾT QUẢ THANH TOÁN</h3>
            </div>
            <div className="table-responsive">
                <div className="form-group">
                    <label>Mã giao dịch thanh toán:</label>
                    <label className="ms-2">{vnp_TxnRef}</label>
                </div>
                <div className="form-group">
                    <label>Số tiền:</label>
                    <label className="ms-2">{vnp_Amount}</label>
                </div>
                <div className="form-group">
                    <label>Mô tả giao dịch:</label>
                    <label className="ms-2">{vnp_OrderInfo}</label>
                </div>
                <div className="form-group">
                    <label>Mã lỗi thanh toán:</label>
                    <label className="ms-2">{vnp_ResponseCode}</label>
                </div>
                <div className="form-group">
                    <label>Mã giao dịch tại CTT VNPAY-QR:</label>
                    <label className="ms-2">{vnp_TransactionNo}</label>
                </div>
                <div className="form-group">
                    <label>Mã ngân hàng thanh toán:</label>
                    <label className="ms-2">{vnp_BankCode}</label>
                </div>
                <div className="form-group">
                    <label>Thời gian thanh toán:</label>
                    <label className="ms-2">{vnp_PayDate}</label>
                </div>
                <div className="form-group">
                    <label>Tình trạng giao dịch:</label>
                    <label className="ms-2">{status}</label>
                </div>
            </div>
            <footer className="footer mt-4">
                <p>&copy; VNPAY 2020</p>
            </footer>
        </div>
    );
};

export default VNPayReturn;