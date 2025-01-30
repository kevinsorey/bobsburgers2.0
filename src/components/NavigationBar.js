import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

function NavigationBar({ currentStep, setCurrentStep, goHome, navigateTo }) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Navbar.Brand href="#" onClick={goHome}>
        Bob's Burgers
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#" onClick={() => setCurrentStep(1)}>Home</Nav.Link>
          <Nav.Link href="#" onClick={() => setCurrentStep(2)}>Menu</Nav.Link>
          <Nav.Link href="#" onClick={() => setCurrentStep(3)}>Order Details</Nav.Link>
          <Nav.Link href="#" onClick={() => setCurrentStep(4)}>Payment</Nav.Link>
          <Nav.Link href="#" onClick={() => navigateTo('testing')}>Testing Tool</Nav.Link>
        </Nav>
        <Button variant="outline-light" onClick={goHome}>
          Reset
        </Button>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;
