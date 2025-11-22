import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sessionId = params.get("session_id");

  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (sessionId) {
      fetch(`${process.env.REACT_APP_API_URL}/checkout-session/${sessionId}`)
        .then((res) => res.json())
        .then((data) => setDetails(data))
        .catch((err) => console.error(err));
    }
  }, [sessionId]);

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">✓</div>

        <h1>Payment Successful 🎉</h1>
        <p className="subtitle">Thank you! Your payment was completed successfully.</p>

        {details ? (
          <div className="details-box">
            <p><strong>Payment ID:</strong> {details.payment_intent}</p>
            <p><strong>Order ID:</strong> {details.id}</p>
            <p>
              <strong>Amount Paid:</strong> ₹{(details.amount_total / 100).toFixed(2)}
            </p>
          </div>
        ) : (
          <p className="loading">Fetching payment details...</p>
        )}

        <div className="buttons">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/cart" className="btn-secondary">View Cart</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
