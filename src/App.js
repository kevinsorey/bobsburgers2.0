import React, { useState } from "react";
import "./App.css";
import PaymentForm from "./components/PaymentForm";
import Receipt from "./components/Receipt";
import WelcomePage from "./components/WelcomePage";
import ItemList from "./components/ItemList";
import OrderDetails from "./components/OrderDetails";
import TestingTool from "./components/TestingTool"; // Import the TestingTool component
import NavigationBar from "./components/NavigationBar";

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [total, setTotal] = useState(0);
  const [itemsInCart, setItemsInCart] = useState([]);
  const [invoice, setInvoice] = useState("");
  const [currentPage, setCurrentPage] = useState("app");

  const nextStep = (invoiceNumber = "") => {
    if (invoiceNumber) {
      setInvoice(invoiceNumber);
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const goHome = () => {
    setCurrentStep(1);
    setTotal(0);
    setItemsInCart([]);
    setInvoice("");
    setCurrentPage("app");
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Add the missing addToTotal function here
  const addToTotal = (price) => {
    setTotal((prevTotal) => prevTotal + price);
  };

  return (
    <div
      className="App"
      style={{
        height: "100%",
        backgroundImage: "url(/background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <NavigationBar
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        goHome={goHome}
        navigateTo={navigateTo}
      />
      <header className="App-header">
        {currentPage === "app" && (
          <>
            {currentStep === 1 && <WelcomePage onNext={nextStep} />}
            {currentStep === 2 && (
              <ItemList
                onNext={nextStep}
                addToTotal={addToTotal} // Pass addToTotal here
                total={total}
                setItemsInCart={setItemsInCart}
                itemsInCart={itemsInCart}
              />
            )}
            {currentStep === 3 && (
              <OrderDetails onNext={nextStep} itemsInCart={itemsInCart} />
            )}
            {currentStep === 4 && (
              <PaymentForm
                onNext={nextStep}
                total={total}
                invoice={invoice}
              />
            )}
            {currentStep === 5 && (
              <Receipt goHome={goHome} invoice={invoice} />
            )}
          </>
        )}
        {currentPage === "testing" && <TestingTool />}
      </header>
    </div>
  );
}

export default App;
