import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './Css/Frominv.css';
import Nav from './Nav';

Modal.setAppElement('#root');

function Frominv() {
    const [Invoice, setInvoice] = useState({
        Num: '',
        formdate: '', // Add formdate field
        Termpay: '',
        Duedate: ''
    });

    const [Customer, setCustomer] = useState({
        Name: '',
        City: '',
        District: '',
        Address: '',
        Tax: ''
    });

    const [products, setProducts] = useState([
        { productCode: '', description: '', quantity: '', unitPrice: '', discount: '' }
    ]);

    const [invoiceId, setInvoiceId] = useState(0); // State for invoice_id

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await fetch('http://localhost:8888/invoices');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setInvoice(data); // Assuming setInvoice is a state updater function
                const numberOfInvoices = data.length;
                setInvoiceId(numberOfInvoices + 1); // Update invoiceId based on fetched data
            } catch (error) {
                console.error('Error fetching Invoices:', error);
            }
        };

        fetchInvoice();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleProductChange = (index, event) => {
        const updatedProducts = [...products];
        updatedProducts[index][event.target.name] = event.target.value;
        setProducts(updatedProducts);
    };

    const addProduct = () => {
        // Check if any of the product fields are empty
        const isAnyFieldEmpty = products.some(product => (
            product.productCode === '' ||
            product.description === '' ||
            product.quantity === '' ||
            product.unitPrice === ''
        ));

        // If any field is empty, prevent adding a new product
        if (isAnyFieldEmpty) {
            alert('กรุณากรอกข้อมูลให้ครบทุกช่องก่อนเพิ่มสินค้าใหม่');
            return;
        }

        // Add new product
        setProducts([...products, { productCode: '', description: '', quantity: '', unitPrice: '', discount: '' }]);
    };


    const deleteProduct = (index) => {
        const updatedProducts = products.filter((_, i) => i !== index);
        setProducts(updatedProducts);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const getCurrentDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const Generate = () => {
        // Check if any field in Invoice is empty
        const isInvoiceEmpty = Object.values(Invoice).some(value => value === '');
        // Check if any field in Customer is empty
        const isCustomerEmpty = Object.values(Customer).some(value => value === '');

        // If any field in either Invoice or Customer is empty, prevent adding a new product
        if (isInvoiceEmpty || isCustomerEmpty) {
            alert('กรุณากรอกข้อมูลให้ครบทุกช่องก่อนเพิ่มแบบฟร์อม');
            return;
        }

        console.log('Data to be sent:', {
            invoice: { ...Invoice, invoice_id: invoiceId }, // Include invoice_id in Invoice data
            customer: { ...Customer, invoice_id: invoiceId }, // Include invoice_id in Customer data
            products: products.map(product => ({ ...product, invoice_id: invoiceId })) // Include invoice_id in each product
        });

        const postData = async (url, data) => {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log(`Data posted successfully to ${url}`);
            } catch (error) {
                console.error('Error posting data:', error);
            }
        };

        const data = {
            invoice: { ...Invoice, invoice_id: invoiceId },
            customer: { ...Customer, invoice_id: invoiceId },
            products: products.map(product => ({ ...product, invoice_id: invoiceId }))
        };

        postData('http://localhost:8888/postproducts', data.products);
        postData('http://localhost:8888/postinvoices', data.invoice);
        postData('http://localhost:8888/postcustomers', data.customer);
    };


    return (
        <div>
            <Nav />
            <div className='box'>
                <h1>Invoice Form</h1>
                <div className="invoice-form">
                    <div className="section">
                        <h2>Invoice Info</h2>
                        <div className="form-row">
                            <label>
                                No (เลข) <span style={{ color: 'red' }}>*</span>
                                <input
                                    type="text"
                                    name="Num"
                                    value={Invoice.Num}
                                    onChange={(e) => setInvoice({ ...Invoice, Num: e.target.value })}
                                />
                            </label>
                            <label>
                                Form date (วันที่) <span style={{ color: 'red' }}>*</span>
                                <input
                                    type="date"
                                    name="formdate"
                                    min={getCurrentDate()}
                                    value={Invoice.formdate}
                                    onChange={(e) => setInvoice({ ...Invoice, formdate: e.target.value })}
                                />
                            </label>
                            <label>
                                Termpay (เงื่อนไขชำระ) <span style={{ color: 'red' }}>*</span>
                                <input
                                    type="text"
                                    name="Termpay"
                                    value={Invoice.Termpay}
                                    onChange={(e) => setInvoice({ ...Invoice, Termpay: e.target.value })}
                                />
                            </label>
                            <label>
                                Duedate (กำหนดชำระ) <span style={{ color: 'red' }}>*</span>
                                <input
                                    type="date"
                                    name="Duedate"
                                    min={getCurrentDate()}
                                    value={Invoice.Duedate}
                                    onChange={(e) => setInvoice({ ...Invoice, Duedate: e.target.value })}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="section">
                        <h2>Customer Info</h2>
                        <div className="form-row">
                            <label>
                                Name (ชื่อลูกค้า) <span style={{ color: 'red' }}>*</span>
                                <input
                                    type="text"
                                    name="Name"
                                    value={Customer.Name}
                                    onChange={(e) => setCustomer({ ...Customer, Name: e.target.value })}
                                />
                            </label>
                            <label>
                                City (จังหวัด) <span style={{ color: 'red' }}>*</span>
                                <input
                                    type="text"
                                    name="City"
                                    value={Customer.City}
                                    onChange={(e) => setCustomer({ ...Customer, City: e.target.value })}
                                />
                            </label>
                            <label>
                                District (อำเภอ) <span style={{ color: 'red' }}>*</span>
                                <input
                                    type="text"
                                    name="District"
                                    value={Customer.District}
                                    onChange={(e) => setCustomer({ ...Customer, District: e.target.value })}
                                />
                            </label>
                        </div>
                        <div className="form-row">
                            <label>
                                Address (ที่อยู่) <span style={{ color: 'red' }}>*</span>
                                <input
                                    type="text"
                                    name="Address"
                                    value={Customer.Address}
                                    onChange={(e) => setCustomer({ ...Customer, Address: e.target.value })}
                                />
                            </label>
                            <label>
                                Tax ID number (หมายเลขผู้เสียภาษี) <span style={{ color: 'red' }}>*</span>
                                <input
                                    type="text"
                                    name="Tax"
                                    value={Customer.Tax}
                                    onChange={(e) => setCustomer({ ...Customer, Tax: e.target.value })}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="section">
                        <h2>Product Table</h2>
                        {products.map((product, index) => (
                            <div key={index} className={`product-entry ${index === products.length - 1 ? '' : 'hidden'}`}>
                                <div className="form-row">
                                    <label>
                                        Product code (รหัสสินค้า) <span style={{ color: 'red' }}>*</span>
                                        <input
                                            type="text"
                                            name="productCode"
                                            value={product.productCode}
                                            onChange={(e) => handleProductChange(index, e)}
                                        />
                                    </label>
                                    <label>
                                        Description (รายการสินค้า) <span style={{ color: 'red' }}>*</span>
                                        <input
                                            type="text"
                                            name="description"
                                            value={product.description}
                                            onChange={(e) => handleProductChange(index, e)}
                                        />
                                    </label>
                                    <label>
                                        Quantity (จำนวน) <span style={{ color: 'red' }}>*</span>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={product.quantity}
                                            onChange={(e) => handleProductChange(index, e)}
                                        />
                                    </label>
                                </div>
                                <div className="form-row">
                                    <label>
                                        Unit price (ราคาต่อหน่อย) <span style={{ color: 'red' }}>*</span>
                                        <input
                                            type="number"
                                            name="unitPrice"
                                            step="0.01"
                                            value={product.unitPrice}
                                            onChange={(e) => handleProductChange(index, e)}
                                        />
                                    </label>
                                    <label>
                                        Discount (ส่วนลด %):
                                        <input
                                            type="number"
                                            name="discount"
                                            step="0.01"
                                            value={product.discount}
                                            onChange={(e) => handleProductChange(index, e)}
                                        />
                                    </label>
                                    {index !== products.length - 1 && (
                                        <button type="button" onClick={() => deleteProduct(index)}>Delete</button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addProduct}>Add Product</button>
                        <br />
                        {products.length > 1 && (
                            <button type="button" onClick={openModal}>
                                Show Previous Products
                            </button>
                        )}
                    </div>
                </div>
                <button type="submit" onClick={Generate}>Generate Invoice</button>
                <br />

                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Previous Products"
                    className="modal"
                    overlayClassName="modal-overlay"
                >
                    <h2>Previous Products</h2>
                    {products.slice(0, -1).map((product, index) => (
                        <div key={index} className="product-entry">
                            <div className="form-row">
                                <label>
                                    <p style={{ marginTop: 13 }}>Description (รายการสินค้า) :</p>
                                    <p>{product.description}</p>
                                </label>
                                <button type="button" onClick={() => deleteProduct(index)}>Delete</button>
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={closeModal}>Close</button>
                </Modal>
            </div>
        </div>
    );
}

export default Frominv;
