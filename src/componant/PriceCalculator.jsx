import React, { useState, useEffect } from 'react';
import './Css/PriceCalculator.css'; // Import the CSS file
import { Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const PriceCalculator = () => {
  const [exchangeRate, setExchangeRate] = useState(36);
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [dataofproduct, setDataofproduct] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState('');

  useEffect(() => {
    const fetchdataproduct = async () => {
      try {
        const response = await fetch('http://localhost:8888/dataofpro');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDataofproduct(data);  // Assuming data is an array of objects
        console.log('Fetched data:', data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchdataproduct();
  }, []);

  const addProduct = () => {
    setProducts([...products, {
      id: products.length + 1,
      priceListEur: '',
      productDiscount: '',
      margin: '',
      customerDiscount: '',
      name: '',  // New field for product name
    }]);
    setCurrentIndex(products.length); // Show the newly added product form
    setSelectedProductName(''); // Reset selected name
  };

  const updateProduct = (field, value) => {
    const updatedProducts = products.map((product, index) =>
      index === currentIndex ? { ...product, [field]: value } : product
    );
    setProducts(updatedProducts);
  };

  const deleteProduct = (id) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    if (currentIndex >= updatedProducts.length) {
      setCurrentIndex(updatedProducts.length - 1);
    }
  };

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

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const handleSubmit = async () => {
    console.log('Data to be submitted:', {
      PriceList: products.map(p => p.priceListEur),
      ProDiscount_per: products.map(p => p.productDiscount),
      Margin_per: products.map(p => p.margin),
      CusDiscount_per: products.map(p => p.customerDiscount),
      Cost: allResults.map(result => result.costEur),
      PriceList_Margin: allResults.map(result => result.priceWithMarginEur),
      Customer_Price: allResults.map(result => result.customerPriceEur),
      Profit: allResults.map(result => result.profitEur),
      Profit_per: allResults.map(result => result.profitPercentage),
    });

    try {
      const response = await fetch('http://localhost:8888/dataofcalprofit/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          PriceList: products.map(p => p.priceListEur),
          ProDiscount_per: products.map(p => p.productDiscount),
          Margin_per: products.map(p => p.margin),
          CusDiscount_per: products.map(p => p.customerDiscount),
          Cost: allResults.map(result => result.costEur),
          PriceList_Margin: allResults.map(result => result.priceWithMarginEur),
          Customer_Price: allResults.map(result => result.customerPriceEur),
          Profit: allResults.map(result => result.profitEur),
          Profit_per: allResults.map(result => result.profitPercentage),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Data submitted successfully!');
      } else {
        alert('Error submitting data: ' + data.message);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('An error occurred while submitting data.');
    }
  };

  const handleNameChange = (event) => {
    setSelectedProductName(event.target.value);
    updateProduct('name', event.target.value);
  };

  const currentResult = products.length > 0 ? calculateValues(
    products[currentIndex].priceListEur,
    products[currentIndex].productDiscount,
    products[currentIndex].margin,
    products[currentIndex].customerDiscount
  ) : null;

  return (
    <div className="price-calculator">
      <div className="form-container">
        <h2>Price List Calculator</h2>
        {products.length > 0 && !showAll && (
          <div className="product-form">
            <h3>Product {products[currentIndex].name || products[currentIndex].id}</h3>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select Name</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={products[currentIndex].name}
                  label="Select Name"
                  onChange={handleNameChange}
                >
                  {dataofproduct.map((item) => (
                    <MenuItem key={item.id} value={item.Name_pro}>
                      {item.Name_pro}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <label>
              Price List (EUR):
              {dataofproduct.map((item) => (
                item.Name_pro === products[currentIndex].name && (
                  <input
                    key={item.id}
                    type="number"
                    value={products[currentIndex].priceListEur = item.Price_pro}
                    onChange={(e) => updateProduct('priceListEur', parseFloat(e.target.value) || '')}
                  />
                )
              ))}
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
            {currentResult && (
              <div className="results">
                <p>Cost (EUR): {currentResult.costEur.toFixed(2)}</p>
                <p>Cost (THB): {currentResult.costThb.toFixed(2)}</p>
                <p>Price with Margin (EUR): {currentResult.priceWithMarginEur.toFixed(2)}</p>
                <p>Price with Margin (THB): {currentResult.priceWithMarginThb.toFixed(2)}</p>
                <p>Customer Price (EUR): {currentResult.customerPriceEur.toFixed(2)}</p>
                <p>Customer Price (THB): {currentResult.customerPriceThb.toFixed(2)}</p>
                <p>Profit (EUR): {currentResult.profitEur.toFixed(2)}</p>
                <p>Profit (THB): {currentResult.profitThb.toFixed(2)}</p>
                <p>Profit (%): {currentResult.profitPercentage.toFixed(2)}</p>
              </div>
            )}
            <div className="buttons">
              <Button variant="outlined" onClick={previousProduct} disabled={currentIndex === 0}>
                Previous
              </Button>
              <Button variant="outlined" onClick={nextProduct} disabled={currentIndex === products.length - 1}>
                Next
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => deleteProduct(products[currentIndex].id)}>
                Delete
              </Button>
            </div>
          </div>
        )}
        {showAll && (
          <div className="all-results">
            <h3>All Products</h3>
            {products.map((product, index) => (
              <div key={product.id} className="product-result">
                <h4>Product {product.name || product.id}</h4>
                <p>Price List (EUR): {product.priceListEur}</p>
                <p>Product Discount (%): {product.productDiscount}</p>
                <p>Margin (%): {product.margin}</p>
                <p>Customer Discount (%): {product.customerDiscount}</p>
                <Button variant="outlined" color="secondary" onClick={() => deleteProduct(product.id)}>
                  Delete
                </Button>
              </div>
            ))}
            <div className="total-results">
              <h3>Total Results</h3>
              <p>Total Cost (EUR): {totalResults.costEur.toFixed(2)}</p>
              <p>Total Cost (THB): {totalResults.costThb.toFixed(2)}</p>
              <p>Total Price with Margin (EUR): {totalResults.priceWithMarginEur.toFixed(2)}</p>
              <p>Total Price with Margin (THB): {totalResults.priceWithMarginThb.toFixed(2)}</p>
              <p>Total Customer Price (EUR): {totalResults.customerPriceEur.toFixed(2)}</p>
              <p>Total Customer Price (THB): {totalResults.customerPriceThb.toFixed(2)}</p>
              <p>Total Profit (EUR): {totalResults.profitEur.toFixed(2)}</p>
              <p>Total Profit (THB): {totalResults.profitThb.toFixed(2)}</p>
              <p>Total Profit (%): {totalResults.profitPercentage.toFixed(2)}</p>
            </div>
          </div>
        )}
        {!showAll && (
          <Button variant="outlined" onClick={addProduct}>
            Add Product
          </Button>
        )}
        <Button variant="outlined" onClick={toggleShowAll}>
          {showAll ? 'Show Single Product' : 'Show All Products'}
        </Button>
        <Button variant="outlined" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default PriceCalculator;
