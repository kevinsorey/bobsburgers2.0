import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/esm/Container";
import { processPayment } from "../utils/stripePayment"; // Import the correct function

function PaymentForm({ total, onNext, invoice }) {
  const [gateway, setGateway] = useState("stripe"); // Default payment provider is Stripe
  const [enable3DS, setEnable3DS] = useState(false); // Default: 3DS disabled
  const [cardInfo, setCardInfo] = useState({
    "card-number": "",
    "card-expiration-date": "",
    "card-security-code": "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle credit card input changes
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;

    // Automatically format expiration date (MM/YY)
    if (name === "card-expiration-date") {
      let formattedValue = value.replace(/\D/g, ""); // Remove non-numeric characters
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2, 4);
      }
      setCardInfo({ ...cardInfo, [name]: formattedValue });
    } else {
      setCardInfo({ ...cardInfo, [name]: value });
    }
  };

  // Handle payment submission
  const handlePayment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await processPayment(cardInfo, total, gateway, enable3DS);
      console.log("Payment successful:", response);
      onNext();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please check your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container
      style={{
        maxWidth: "500px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        border: "3px solid #e0871a",
        boxShadow: "0 0 25px 0 black",
        padding: "20px",
        marginTop: "50px",
      }}
    >
      <h3>Total: ${total}</h3> {/* Display the total */}
      <h4>Invoice #: {invoice}</h4> {/* Display invoice number */}
      <hr />

      {/* Payment Provider Selection */}
      <Form.Group controlId="paymentProvider">
        <Form.Label>Select Payment Provider:</Form.Label>
        <Form.Control as="select" value={gateway} onChange={(e) => setGateway(e.target.value)}>
          <option value="stripe">Stripe</option>
          <option value="shift4">Shift4</option>
        </Form.Control>
      </Form.Group>

      {/* 3DS Toggle */}
      <Form.Group controlId="enable3DS">
        <Form.Check
          type="checkbox"
          label="Enable 3D Secure (3DS)"
          checked={enable3DS}
          onChange={() => setEnable3DS(!enable3DS)}
        />
      </Form.Group>

      {/* Credit Card Section */}
      <h3 className="lead">Credit Card Information</h3>
      <Form.Group controlId="cardNumber">
        <Form.Label>Card Number:</Form.Label>
        <Form.Control
          type="text"
          name="card-number"
          required
          value={cardInfo["card-number"]}
          onChange={handleCardInputChange}
        />
      </Form.Group>

      <Form.Group controlId="cardExpirationDate">
        <Form.Label>Expiration Date (MM/YY):</Form.Label>
        <Form.Control
          type="text"
          name="card-expiration-date"
          required
          maxLength="5"
          value={cardInfo["card-expiration-date"]}
          onChange={handleCardInputChange}
        />
      </Form.Group>

      <Form.Group controlId="cardSecurityCode">
        <Form.Label>Security Code:</Form.Label>
        <Form.Control
          type="text"
          name="card-security-code"
          required
          value={cardInfo["card-security-code"]}
          onChange={handleCardInputChange}
        />
      </Form.Group>

      <br />
      <div className="text-center mt-4">
        <Button variant="primary" size="lg" type="submit" onClick={handlePayment} disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </Container>
  );
}

export default PaymentForm;
