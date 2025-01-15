import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ bookId, quantity, totalPrice }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { data } = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookId, quantity }),
    }).then((res) => res.json());

    const { clientSecret } = data;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "Customer",
        },
      },
    });

    if (result.error) {
      setError(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        alert("Payment succeeded!");
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Complete Your Purchase</h3>
      <div>
        <p>Book: Book Title</p>
        <p>Total: ${totalPrice / 100}</p>
      </div>
      <CardElement />
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};


// Common Test Card Numbers:
// Successful Payment (any amount):

// Card Number: 4242 4242 4242 4242
// Expiry Date: Any future date (e.g., 12/34)
// CVC: Any 3 digits (e.g., 123)
// This will simulate a successful payment.

// Card Declined:

// Card Number: 4000 0000 0000 9995
// Expiry Date: Any future date
// CVC: Any 3 digits
// This will simulate a declined card.

// Insufficient Funds:

// Card Number: 4000 0000 0000 9999
// Expiry Date: Any future date
// CVC: Any 3 digits
// This will simulate insufficient funds.

// Expired Card:

// Card Number: 4000 0000 0000 0069
// Expiry Date: A past date (e.g., 01/20)
// CVC: Any 3 digits