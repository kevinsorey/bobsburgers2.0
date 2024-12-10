import React from "react";
import Button from 'react-bootstrap/Button';

function Receipt({ goHome, invoice }) {
  const handlePrint = () => {
    window.print(); // Triggers the browser's print dialog
  };

  return (
    <div className="app-container">
              <div className="text-center">
          <img 
            src="/logo.jpg"  // Link to logo.jpg in the public folder
            alt="Logo" 
            style={{ width: '200px', marginTop: '20px' }} 
          />
        </div>
        <hr />
      <div className="text-center">
        <h2>Thank You!</h2>
        <p>Your payment has been received.</p>
        <p>Receipt: #{invoice}</p> {/* Display the invoice number */}
        
        <div className="mt-3">
          <Button variant="secondary" onClick={handlePrint} className="me-2">
            Print
          </Button>
          <Button variant="primary" onClick={goHome}>
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Receipt;
