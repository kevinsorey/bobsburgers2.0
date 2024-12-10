import React, { useState } from "react";
import './App.css';
import PaymentForm from "./components/PaymentForm";
import Receipt from "./components/Receipt";
import WelcomePage from "./components/WelcomePage";
import ItemList from "./components/ItemList";
import OrderDetails from "./components/OrderDetails";

function App () {

  const [currentStep, setCurrentStep] = useState(1);
  const [total, setTotal] = useState(0);
  const [itemsInCart, setItemsInCart] = useState([]);
  const [invoice, setInvoice] = useState(""); // State to hold the invoice number

  const nextStep = (invoiceNumber = "") => {
    if (invoiceNumber) {
      setInvoice(invoiceNumber); // Save the generated invoice number
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };
  
  const goHome = () => {
    setCurrentStep(1); // Reset to the welcome page
    setTotal(0); 
    setItemsInCart([]); // Reset the items in cart
    setInvoice(""); // Reset the invoice number
  };

  // Function to add item price to total
  const addToTotal = (price) => {
    setTotal((prevTotal) => prevTotal + price);
  };

  return (
       <div 
      className="App" 
      style={{
        height: '100%', 
        backgroundImage: 'url(/background.jpg)', // Link to background.jpg in the public folder
        backgroundSize: 'cover', 
        backgroundPosition: 'center'
      }}
    >
      <header className="App-header">

        
        {currentStep === 1 && <WelcomePage onNext={nextStep} />}
        {currentStep === 2 && <ItemList 
          onNext={nextStep} 
          addToTotal={addToTotal} 
          total={total} 
          setItemsInCart={setItemsInCart} 
          itemsInCart={itemsInCart} 
        />}
        {currentStep === 3 && <OrderDetails 
          onNext={nextStep} 
          itemsInCart={itemsInCart} 
        />}
        {currentStep === 4 && <PaymentForm 
          onNext={nextStep} 
          total={total} 
          invoice={invoice} // Pass the invoice number to PaymentForm
        />}
        {currentStep === 5 && <Receipt 
          goHome={goHome} 
          invoice={invoice} // Pass the invoice to Receipt
        />}
      </header>
    </div>
  );
}

export default App;
