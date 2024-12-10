import React from "react";
import { Row, Col, Card, Button, Container } from "react-bootstrap"; 

function OrderDetails({ itemsInCart, onNext }) {
  const getTotalPrice = (item) => item.price * item.count;

  // Generate a random invoice number
  const generateInvoice = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let invoice = '';
    for (let i = 0; i < 8; i++) {
      invoice += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return invoice;
  };

  const invoiceNumber = generateInvoice();

  return (
    <Container style={{
        maxWidth: '500px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        border: '3px solid #e0871a',
        boxShadow: '0 0 25px 0 black',
        padding: '20px',
        marginTop: '50px',
      }}>
         <div className="text-center">
          <img 
            src="/logo.jpg"  // Link to logo.jpg in the public folder
            alt="Logo" 
            style={{ width: '200px', marginTop: '20px' }} 
          />
        </div>
        <hr />
      <div>
        <h2>Order Details</h2>
        {itemsInCart.length > 0 ? (
          itemsInCart.map((item) => (
            <Card key={item.id} className="mb-3">
              <Card.Body>
                <Row className="d-flex align-items-center">
                  <Col xs={6}>
                    <h5>{item.name}</h5>
                    <p>Quantity: {item.count}</p>
                  </Col>
                  <Col xs={6} className="text-right">
                    <p>Price: ${item.price}</p>
                    <p>Total: ${getTotalPrice(item)}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
        <hr />
        <div className="text-right">
          <h4>Total: ${itemsInCart.reduce((acc, item) => acc + getTotalPrice(item), 0)}</h4>
        </div>
      </div>
      <Button variant="primary" onClick={() => onNext(invoiceNumber)}>Proceed to Payment</Button>
    </Container>
  );
}

export default OrderDetails;
