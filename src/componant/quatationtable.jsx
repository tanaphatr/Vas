import React, { useRef, useState, useEffect } from 'react';
import './Css/Pngpage.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logoDark from './image/images.jpg';
import ThaiBahtText from 'thai-baht-text';
import Nav from './Nav';
import { MenuItem, Select, Button, InputLabel, Box, FormControl } from '@mui/material';

function quatationtable() {
    const [Customer, setCustomer] = useState([]);
    const [quatations, setquatations] = useState([]);
    const [product, setproduct] = useState([]);
    const [id ,setId] = useState([]);
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await fetch('http://localhost:8888/Customers');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCustomer(data);  // Assuming setCustomer is a state updater function
                console.log('Fetched customers:', data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        const fetchquatations = async () => {
            try {
                const response = await fetch('http://localhost:8888/quatations');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setquatations(data); 
                console.log('Fetched quatations:', filteredData);
            } catch (error) {
                console.error('Error fetching quatations:', error);
            }
        };

        const fetchproduct = async () => {
            try {
                const response = await fetch('http://localhost:8888/products');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setproduct(data);  // Assuming setCustomer is a state updater function
                console.log('Fetched product:', data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchCustomer();
        fetchquatations();
        fetchproduct();  // Call the fetchCustomer function
    }, []);


    const componentRef = useRef();

    const handleGeneratePDF = () => {
        const input = componentRef.current;
        const originalWidth = input.offsetWidth;
        const originalHeight = input.offsetHeight;

        // Adjust the size of the element to A4 size (210mm x 297mm in pixels)
        input.style.width = '250mm';
        input.style.height = '297mm';

        html2canvas(input, { scale: 5 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/jpeg', 1);
            const pdf = new jsPDF('p', 'mm', 'a4'); // specify A4 page size
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('invoice.pdf');

            // Reset the element size back to original
            input.style.width = `${originalWidth}px`;
            input.style.height = `${originalHeight}px`;
        });
    };

    const productsWithInvoice1 = product.filter(product =>
        quatations.some(quatation => quatation.Product_id === product.invoice_id)
    );


    // คำนวณผลรวมทั้งหมดของสินค้า
    const totalAmount = productsWithInvoice1.reduce((total, product) => {
        const totalPrice = product.unit_price * product.quantity * (1 - product.discount / 100);
        return total + totalPrice;
    }, 0);

    // คำนวณภาษีมูลค่าเพิ่ม
    const vatAmount = productsWithInvoice1.reduce((totalVat, product) => {
        const totalPrice = product.unit_price * product.quantity * (1 - product.discount / 100);
        const vat = totalPrice * 0.07;
        return totalVat + vat;
    }, 0);

    // คำนวณ Grand Total
    const grandTotal = totalAmount - vatAmount;

    // ใช้ ThaiBahtText หรือ numeral.js แปลงเลขเป็นคำภาษาไทย
    const thaiBaht = ThaiBahtText(grandTotal.toFixed(2));

    const [selectedId, setSelectedId] = useState('');

    const handleChange = (event) => {
        const id = event.target.value;
        setSelectedId(id);
        setId(id);
    };
    return (
        <div>
            <Nav />
            <div class="div-center">
                <div className="button-container">
                    <Button onClick={handleGeneratePDF}>Generate PDF</Button>
                    <Button onClick={() => window.location.href = "/Invoicetable"}>Invoice PDF</Button>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select ID</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedId}
                                label="Select ID"
                                onChange={handleChange}
                            >
                                {quatations.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.id}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </div>
                <hr />
                <div ref={componentRef} className="container small-font">
                    <br />
                    <div className="invoice">
                        <div className="header">
                            <div>
                                <img src={logoDark} alt="Description of your image" style={{ width: 70, height: 50 }} />
                            </div>
                            <div className="company-info">
                                <h2>บริษัท แวสว็อคซ์ จำกัด (สำนักงานใหญ่)</h2>
                                <p>8/114 หมู่บ้านศุภาลัยการ์เด้นวิลล์ ถนนพัฒนาชนบท 3 แขวงคลองสองต้นนุ่น</p>
                                <p>เขตลาดกระบัง กรุงเทพมหานคร 10520 โทร 02-026-2323</p>
                                <p>VASVOX CO., LTD.</p>
                                <p>8/114 Supalai Garden Ville, Patthana Chonabot 3, Khlong Song Ton Nun,</p>
                                <p>Lat Krabang, Bangkok 10520 www.vasvox.com</p>
                            </div>
                            <div className="invoice-info">
                                <tr>
                                    <th>
                                        <h3>ใบเสนอราคา</h3>
                                        <h3>QUOTATION</h3>
                                    </th>
                                </tr>
                                <td></td>
                                <br />
                                <p>หมายเลขประจำตัวผู้เสียภาษี 0105555138911</p>
                            </div>
                        </div>
                        <div className="header">
                            <div className="customer-info">
                                {quatations.map(quatation => (
                                    Customer.filter(customer => customer.invoice_id === quatation.customers_id).map((customer, index) => (
                                        <div key={index}>
                                            <h4>ชื่อลูกค้า/ที่อยู่ Customer Name/Address</h4>
                                            <h3>{customer.NAME}</h3>
                                            <p>{customer.address}</p>
                                            <p>{customer.city} {customer.district}</p>
                                            <p>หมายเลขประจำตัวผู้เสียภาษีอากร {customer.tax_id}</p>
                                        </div>
                                    ))
                                ))}
                            </div>
                            <div className="header2">
                                {quatations.map((quatations, index) => (
                                    <div key={index}>
                                        <table>
                                            <tr>
                                                <th>เลขที่ No.</th>
                                                <td>{quatations.num}</td>
                                            </tr>
                                            <tr>
                                                <th>วันที่ Date</th>
                                                <td>{new Date(quatations.from_date).toLocaleDateString('th-TH')}</td>
                                            </tr>
                                            <tr>
                                                <th>เงื่อนไขชำระเงิน Term Payment</th>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <th>กำหนดชำระเงิน Due Date</th>
                                                <td></td>
                                            </tr>

                                            <tr>
                                                <th>ยืนราคา Validity Period</th>
                                                <td>{quatations.Validity}</td>
                                            </tr>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '5%' }}>
                                        <p>ที่</p>
                                        <p>ITEM</p>
                                    </th>
                                    <th style={{ width: '15%' }}>
                                        <p>รหัสสินค้า</p>
                                        <p>PRODUCT CODE</p>
                                    </th>
                                    <th style={{ width: '45%' }}>
                                        <p>รายการ</p>
                                        <p>DESCRIPTION</p>
                                    </th>
                                    <th style={{ width: '5%' }}>
                                        <p>จำนวน</p>
                                        <p>QUANTITY</p>
                                        <p>(Unit)</p>
                                    </th>
                                    <th style={{ width: '10%' }}>
                                        <p>หน่วยละ</p>
                                        <p>UNIT PRICE</p>
                                        <p>(THB)</p>
                                    </th>
                                    <th style={{ width: '10%' }}>
                                        <p>ส่วนลด</p>
                                        <p>DISCOUNT</p>
                                        <p>(%)</p>
                                    </th>
                                    <th style={{ width: '10%' }}>
                                        <p>จำนวนเงิน</p>
                                        <p>AMOUNT</p>
                                        <p>(THB)</p>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {quatations.map(quatation => (
                                    product.filter(product => product.invoice_id === quatation.Product_id).map((product, index) => (
                                        <tr key={index}>
                                            <td>
                                                <p align="center" className="container small-font">{index + 1}</p>
                                            </td>
                                            <td>
                                                <p className="container small-font">{product.product_code}</p>
                                            </td>
                                            <td>
                                                <p className="container small-font">{product.description}</p>
                                            </td>
                                            <td>
                                                <p align="center" className="container small-font">{product.quantity}</p>
                                            </td>
                                            <td>
                                                <p align="center" className="container small-font">{product.unit_price}</p>
                                            </td>
                                            <td>
                                                <p align="center" className="container small-font">{product.discount}%</p>
                                            </td>
                                            <td>
                                                <p align="center" className="container small-font">{(product.unit_price * product.quantity * (1 - product.discount / 100)).toFixed(2)}</p>
                                            </td>
                                        </tr>
                                    ))
                                ))}
                            </tbody>
                        </table>
                        <table className="invoice-table2">
                            <tr>
                                <td></td>
                                <th>รวมจำนวนเงิน TOTAL AMOUNT</th>
                                <td>{totalAmount.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <th>ภาษีมูลค่าเพิ่ม VAT</th>
                                <td>{vatAmount.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <th>{thaiBaht}</th>
                                <th>รวมทั้งสิ้น GRAND TOTAL</th>
                                <td>{grandTotal.toFixed(2)}</td>
                            </tr>
                        </table>
                        <div className="footer">
                            {quatations.filter(quatations => quatations.id === id).map((quatations, index) => (
                                <div className="terms" key={index}>
                                    <p style={{ textAlign: 'left', fontWeight: 'bold' }}>เงื่อนไขการชำระเงิน</p>
                                    <p style={{ textAlign: 'left' }}>{quatations.Paymentterms}</p>
                                </div>
                            ))}
                            <div className="signature">
                                <p style={{ fontWeight: 'bold' }}>ผู้ยืนยันคำสั่งซื้อ</p>
                                <br />
                                <br />
                                <br />
                                <br />
                                <p>.........................................................</p>
                                <p>ผู้มีอำนาจลงนาม/Authorized Signature</p>
                                <br />
                                <p>วันที่......................................</p>
                            </div>
                            <div className="on-behalf">
                                <p style={{ fontWeight: 'bold' }}>ผู้เสนอราคา/อนุมัติ</p>
                                <br />
                                <br />
                                <br />
                                <br />
                                <p>.........................................................</p>
                                <p>(นายสุริยา กันทะลือ)</p>
                                <br />
                                <p>ผู้จัดการฝ่ายขาย</p>
                            </div>
                        </div>
                        <p className="internal-use">Internal Use Only</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default quatationtable;
