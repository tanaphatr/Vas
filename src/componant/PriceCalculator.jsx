import React, { useState } from 'react';
import './Css/PriceCalculator.css'; // Import the CSS file
import { Button } from '@mui/material';

const PriceCalculator = () => {
  // State for input fields and products
  const [exchangeRate, setExchangeRate] = useState(36);
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  // Add a new product entry
  const addProduct = () => {
    setProducts([...products, {
      id: products.length + 1,
      priceListEur: '',
      productDiscount: '',
      margin: '',
      customerDiscount: ''
    }]);
    setCurrentIndex(products.length); // Show the newly added product form
  };

  // Update product details
  const updateProduct = (field, value) => {
    const updatedProducts = products.map((product, index) =>
      index === currentIndex ? { ...product, [field]: value } : product
    );
    setProducts(updatedProducts);
  };

  // Delete a product
  const deleteProduct = (id) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    // Reset current index if necessary
    if (currentIndex >= updatedProducts.length) {
      setCurrentIndex(updatedProducts.length - 1);
    }
  };

  // Calculations
  const calculateValues = (priceListEur, productDiscount, margin, customerDiscount) => {
    const costEur = priceListEur * (1 - productDiscount / 100);
    const costThb = costEur * exchangeRate;
    const priceWithMarginEur = priceListEur * (1 + margin / 100);
    const priceWithMarginThb = priceWithMarginEur * exchangeRate;
    const customerPriceEur = priceWithMarginEur * (1 - customerDiscount / 100);
    const customerPriceThb = customerPriceEur * exchangeRate;
    const profitEur = customerPriceEur - costEur;
    const profitThb = customerPriceThb - costThb;
    const profitPercentage = (profitEur / costEur) * 100;

    return {
      costEur,
      costThb,
      priceWithMarginEur,
      priceWithMarginThb,
      customerPriceEur,
      customerPriceThb,
      profitEur,
      profitThb,
      profitPercentage,
    };
  };

  // Results for current product
  const currentProduct = products[currentIndex];
  const currentResult = currentProduct
    ? calculateValues(
        currentProduct.priceListEur,
        currentProduct.productDiscount,
        currentProduct.margin,
        currentProduct.customerDiscount
      )
    : null;

  // Calculate total results for all products
  const allResults = products.map(product => calculateValues(
    product.priceListEur,
    product.productDiscount,
    product.margin,
    product.customerDiscount
  ));

  const totalResults = allResults.reduce((totals, result) => {
    return {
      costEur: totals.costEur + result.costEur,
      costThb: totals.costThb + result.costThb,
      priceWithMarginEur: totals.priceWithMarginEur + result.priceWithMarginEur,
      priceWithMarginThb: totals.priceWithMarginThb + result.priceWithMarginThb,
      customerPriceEur: totals.customerPriceEur + result.customerPriceEur,
      customerPriceThb: totals.customerPriceThb + result.customerPriceThb,
      profitEur: totals.profitEur + result.profitEur,
      profitThb: totals.profitThb + result.profitThb,
      profitPercentage: totals.profitEur > 0 ? (totals.profitEur / totals.costEur) * 100 : 0
    };
  }, {
    costEur: 0,
    costThb: 0,
    priceWithMarginEur: 0,
    priceWithMarginThb: 0,
    customerPriceEur: 0,
    customerPriceThb: 0,
    profitEur: 0,
    profitThb: 0,
    profitPercentage: 0,
  });

  // Handle navigation between products
  const nextProduct = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const previousProduct = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Toggle show all products
  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="price-calculator">
      <div className="form-container">
        <h2>Price List Calculator</h2>
        {products.length > 0 && !showAll && (
          <div className="product-form">
            <h3>Product {products[currentIndex].id}</h3>
            <label>
              Price List (EUR):
              <input
                type="number"
                value={products[currentIndex].priceListEur}
                onChange={(e) => updateProduct('priceListEur', parseFloat(e.target.value) || '')}
              />
            </label>
            <label>
              Product Discount (%):
              <input
                type="number"
                value={products[currentIndex].productDiscount}
                onChange={(e) => updateProduct('productDiscount', parseFloat(e.target.value) || '')}
              />
            </label>
            <label>
              Margin (%):
              <input
                type="number"
                value={products[currentIndex].margin}
                onChange={(e) => updateProduct('margin', parseFloat(e.target.value) || '')}
              />
            </label>
            <label>
              Customer Discount (%):
              <input
                type="number"
                value={products[currentIndex].customerDiscount}
                onChange={(e) => updateProduct('customerDiscount', parseFloat(e.target.value) || '')}
              />
            </label>
            <Button onClick={() => deleteProduct(products[currentIndex].id)} color="error">Delete</Button>
            <div className="navigation-buttons">
              <Button onClick={previousProduct} disabled={currentIndex === 0}>Previous</Button>
              <Button onClick={nextProduct} disabled={currentIndex === products.length - 1}>Next</Button>
            </div>
          </div>
        )}
        {!showAll && (
          <Button onClick={addProduct}>Add Product</Button>
        )}
        <Button onClick={toggleShowAll}>
          {showAll ? 'Hide Total Products' : 'Show Total Products'}
        </Button>
      </div>

      <div className="results-container">
        {showAll ? (
          <>
            <h2>Total Results for All Products</h2>
            <div className="product-results">
              <p>Total Cost (EUR): {formatCurrency(totalResults.costEur, 'EUR')}</p>
              <p>Total Cost (THB): {formatCurrency(totalResults.costThb, 'THB')}</p>
              <p>Total Price List + Margin (EUR): {formatCurrency(totalResults.priceWithMarginEur, 'EUR')}</p>
              <p>Total Price List + Margin (THB): {formatCurrency(totalResults.priceWithMarginThb, 'THB')}</p>
              <p>Total Customer Price (EUR): {formatCurrency(totalResults.customerPriceEur, 'EUR')}</p>
              <p>Total Customer Price (THB): {formatCurrency(totalResults.customerPriceThb, 'THB')}</p>
              <p>Total Profit (EUR): {formatCurrency(totalResults.profitEur, 'EUR')}</p>
              <p>Total Profit (THB): {formatCurrency(totalResults.profitThb, 'THB')}</p>
              <p>Total Profit (%): {totalResults.profitPercentage.toFixed(2)}%</p>
            </div>
          </>
        ) : (
          currentResult && (
            <>
              <h2>Calculated Values</h2>
              <div className="product-results">
                <h3>Product {products[currentIndex].id}</h3>
                <br/>
                <p>Cost (EUR): {formatCurrency(currentResult.costEur, 'EUR')}</p>
                <p>Cost (THB): {formatCurrency(currentResult.costThb, 'THB')}</p>
                <p>Price List + Margin (EUR): {formatCurrency(currentResult.priceWithMarginEur, 'EUR')}</p>
                <p>Price List + Margin (THB): {formatCurrency(currentResult.priceWithMarginThb, 'THB')}</p>
                <p>Customer Price (EUR): {formatCurrency(currentResult.customerPriceEur, 'EUR')}</p>
                <p>Customer Price (THB): {formatCurrency(currentResult.customerPriceThb, 'THB')}</p>
                <p>Profit (EUR): {formatCurrency(currentResult.profitEur, 'EUR')}</p>
                <p>Profit (THB): {formatCurrency(currentResult.profitThb, 'THB')}</p>
                <p>Profit (%): {currentResult.profitPercentage.toFixed(2)}%</p>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

const formatCurrency = (amount, currency) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export default PriceCalculator;