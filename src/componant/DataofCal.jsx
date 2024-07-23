import React, { useRef, useState, useEffect } from 'react';
import Nav from './Nav';
import { MenuItem, Select, Button, InputLabel, Box, FormControl } from '@mui/material';

function DataofCal() {
    const [dataofcalprofit, setdataofcalprofit] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [selectedData, setSelectedData] = useState(null);

    useEffect(() => {
        const fetchdatacalprofit = async () => {
            try {
                const response = await fetch('http://localhost:8888/dataofcalprofit');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setdataofcalprofit(data);  // Assuming data is an array of objects
                console.log('Fetched data:', data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchdatacalprofit();
    }, []);

    const handleChange = (event) => {
        const id = event.target.value;
        setSelectedId(id);
        const selectedItem = dataofcalprofit.find(item => item.id === id);
        setSelectedData(selectedItem);
    };

    return (
        <div>
            <Nav />
            <div className="price-calculator">
                <div className="form-container">
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
                                {dataofcalprofit.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.id}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    {selectedData && (
                        <Box sx={{ marginTop: 2 }}>
                        <h3>Selected Data</h3>
                        <Box sx={{ display: 'flex', marginBottom: 1 }}>
                            <Box sx={{ width: '10%' }}>PriceList:</Box>
                            <Box sx={{ width: '10%', textAlign: 'right' }}>{selectedData.PriceList}</Box>
                        </Box>
                        <Box sx={{ display: 'flex', marginBottom: 1 }}>
                            <Box sx={{ width: '10%' }}>Buy=Discount:</Box>
                            <Box sx={{ width: '10%', textAlign: 'right' }}>{selectedData.ProDiscount_per}%</Box>
                        </Box>
                        <Box sx={{ display: 'flex', marginBottom: 1 }}>
                            <Box sx={{ width: '10%' }}>Margin:</Box>
                            <Box sx={{ width: '10%', textAlign: 'right' }}>{selectedData.Margin_per}%</Box>
                        </Box>
                        <Box sx={{ display: 'flex', marginBottom: 1 }}>
                            <Box sx={{ width: '10%' }}>Sell=Discount:</Box>
                            <Box sx={{ width: '10%', textAlign: 'right' }}>{selectedData.CusDiscount_per}%</Box>
                        </Box>
                        <Box sx={{ display: 'flex', marginBottom: 1 }}>
                            <Box sx={{ width: '10%' }}>Cost:</Box>
                            <Box sx={{ width: '10%', textAlign: 'right' }}>{selectedData.Cost}</Box>
                        </Box>
                        <Box sx={{ display: 'flex', marginBottom: 1 }}>
                            <Box sx={{ width: '10%' }}>PriceList+Margin:</Box>
                            <Box sx={{ width: '10%', textAlign: 'right' }}>{selectedData.PriceList_Margin}</Box>
                        </Box>
                        <Box sx={{ display: 'flex', marginBottom: 1 }}>
                            <Box sx={{ width: '10%' }}>CustomerPrice:</Box>
                            <Box sx={{ width: '10%', textAlign: 'right' }}>{selectedData.Customer_Price}</Box>
                        </Box>
                        <Box sx={{ display: 'flex', marginBottom: 1 }}>
                            <Box sx={{ width: '10%' }}>Profit:</Box>
                            <Box sx={{ width: '10%', textAlign: 'right' }}>{selectedData.Profit}</Box>
                        </Box>
                        <Box sx={{ display: 'flex', marginBottom: 1 }}>
                            <Box sx={{ width: '10%' }}>Profit_per:</Box>
                            <Box sx={{ width: '10%', textAlign: 'right' }}>{selectedData.Profit_per}%</Box>
                        </Box>
                    </Box>                    
                    )}
                </div>
            </div>
        </div>
    );
}

export default DataofCal;
