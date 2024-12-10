import React from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Row, Col } from 'react-bootstrap';
import Container from "react-bootstrap/esm/Container";

function ItemList({ addToTotal, setItemsInCart, itemsInCart, onNext, total }) {
  // Sample items, replace with your actual data
  const items = [
    { id: 1, name: "Burger, Fries, and Drink", price: 10 },
    { id: 2, name: "Burger", price: 7 },
    { id: 3, name: "Fries", price: 3 },
    { id: 4, name: "Drink", price: 2 },
  ];

  const handleAddToCart = (item) => {
    // Add item to cart
    setItemsInCart((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        // Update count of existing item
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, count: i.count + 1 } : i
        );
      } else {
        // Add new item with count 1
        return [...prevItems, { ...item, count: 1 }];
      }
    });

    // Update the total
    addToTotal(item.price);
  };

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
        <h2>Items</h2>
        {items.map((item) => (
          <Card key={item.id} className="mb-3">
            <Card.Body>
              <Row className="d-flex align-items-center">
                <Col xs={8}>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>Price: ${item.price}</Card.Text>
                </Col>
                <Col xs={4} className="d-flex justify-content-end">
                  <Button variant="primary" onClick={() => handleAddToCart(item)}>
                    Add to Cart
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
      </div>
      <h3>Total: ${total}</h3>
      <Button variant="primary" onClick={onNext}>View Cart</Button>
    </Container>
  );
}

export default ItemList;
