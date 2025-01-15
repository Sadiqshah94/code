import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SuccessPage = () => {
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [bookPdfUrl, setBookPdfUrl] = useState(null);

  // Extract the sessionId from the URL
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/books/checkout/${sessionId}`
        );
        const payment = response.data.payment;
        if (payment.status === 'succeeded') {
          setPaymentStatus('success');
          setBookPdfUrl(payment.bookPdfUrl);  // Set the URL for the PDF file
        } else {
          setPaymentStatus('failed');
        }
      } catch (error) {
        console.error('Error verifying payment', error);
        setPaymentStatus('failed');
      }
    };

    if (sessionId) {
      verifyPayment();
    }
  }, [sessionId]);

  return (
    <div>
      <h1>Payment Success!</h1>
      {paymentStatus === 'success' ? (
        <>
          <p>Your payment was successful!</p>
          <a href={bookPdfUrl} download>
            <button>Download PDF</button>
          </a>
        </>
      ) : (
        <p>There was an issue with your payment. Please try again.</p>
      )}
    </div>
  );
};

export default SuccessPage;
