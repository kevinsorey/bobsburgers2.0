import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from "react-bootstrap/esm/Container";
import { postStripePayment } from '../utils/stripePayment'; // Import the Stripe payment function

function PaymentForm({ total, onNext, invoice }) {
  const [streetAddress, setStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [cardInfo, setCardInfo] = useState({
    'card-number': '',
    'card-expiration-date': '',
    'card-security-code': ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Example side effect (if needed)
  }, [total]);

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;

    // If the field being edited is the expiration date, automatically add '/'
    if (name === 'card-expiration-date') {
      // Remove all non-numeric characters
      let formattedValue = value.replace(/\D/g, '');
      
      // If the value is more than 2 characters, add a slash at the correct position
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`;
      }

      setCardInfo({
        ...cardInfo,
        [name]: formattedValue,
      });
    } else {
      // For other fields, just update as normal
      setCardInfo({
        ...cardInfo,
        [name]: value,
      });
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await postStripePayment(cardInfo, total); // Pass total here
      console.log('Payment successful:', response);
      //alert('Payment successful!'); // Display success message
      onNext(); // Trigger the next step
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container
      style={{
        maxWidth: '500px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        border: '3px solid #e0871a',
        boxShadow: '0 0 25px 0 black',
        padding: '20px',
        marginTop: '50px',
      }}
    >
      <div className="text-center">
        <img 
          src="/logo.jpg"  // Link to logo.jpg in the public folder
          alt="Logo" 
          style={{ width: '200px', marginTop: '20px' }} 
        />
      </div>
      <hr />
      <h3>Total: ${total}</h3> {/* Display the total */}
      <h4>Invoice #: {invoice}</h4> {/* Display invoice number */}
      <hr />

      {/* Credit Card Section */}
      <h3 className="lead">Credit Card Information</h3>
      <Form.Group controlId="cardNumber">
        <Form.Label>Card Number:</Form.Label>
        <Form.Control
          type="text"
          name="card-number"
          required
          value={cardInfo['card-number']}
          onChange={handleCardInputChange}
        />
      </Form.Group>

      <Form.Group controlId="cardExpirationDate">
        <Form.Label>Expiration Date (MM/YY):</Form.Label>
        <Form.Control
          type="text"
          name="card-expiration-date"
          required
          value={cardInfo['card-expiration-date']}
          onChange={handleCardInputChange}
        />
      </Form.Group>

      <Form.Group controlId="cardSecurityCode">
        <Form.Label>Security Code:</Form.Label>
        <Form.Control
          type="text"
          name="card-security-code"
          required
          value={cardInfo['card-security-code']}
          onChange={handleCardInputChange}
        />
      </Form.Group>
      <hr />
      {/* Billing Address Section */}
      <h3 className="lead">Billing Address</h3>
      <Form.Group controlId="streetAddress">
        <Form.Label>Street Address:</Form.Label>
        <Form.Control
          type="text"
          required
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="postalCode">
        <Form.Label>Postal Code:</Form.Label>
        <Form.Control
          type="text"
          required
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />
      </Form.Group>
      <br />

      <div className="text-center mt-4">
        <Button 
          variant="primary" 
          size="lg" 
          type="submit" 
          onClick={handlePayment} 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Pay Now'}
        </Button>
      </div>
    </Container>
  );
}

export default PaymentForm;
