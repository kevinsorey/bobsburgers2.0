import React from "react";
import Button from 'react-bootstrap/Button';

function WelcomePage({ onNext }) {
  return (
    <div className="welcome-container">
              <div className="text-center">
          <img 
            src="/logo.jpg"  // Link to logo.jpg in the public folder
            alt="Logo" 
            style={{ width: '200px', marginTop: '20px' }} 
          />
        </div>
      <h1>Welcome!</h1>
      <p>Ready to place your order?</p>
      <Button variant="primary" onClick={onNext}>
        Order Online
      </Button>
    
    </div>
  );
}

export default WelcomePage;