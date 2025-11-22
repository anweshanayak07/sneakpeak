import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./PaymentCancel.css";

const PaymentCancel = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const orderId = queryParams.get("order_id");
  const reason = queryParams.get("reason");

  return (
    <div className="cancel-container">
      <div className="cancel-card">

        <div className="cancel-icon">✕</div>

        <h1>Payment Failed ❌</h1>

        <p className="subtitle">
          Your payment could not be processed.
        </p>

        <div className="details-box">
          <p><strong>Order ID:</strong> {orderId || "N/A"}</p>
          <p><strong>Reason:</strong> {reason || "Payment cancelled by user"}</p>
        </div>

        <div className="buttons">
          <Link to="/cart" className="btn-primary-red">Try Again</Link>
          <Link to="/" className="btn-secondary">Back to Home</Link>
        </div>

      </div>
    </div>
  );
};

export default PaymentCancel;
