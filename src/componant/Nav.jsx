import React from 'react';
import './Css/Nav.css';
import { Stack, Box ,Button} from '@mui/material';

function Nav() {
    return (
        <nav className="nav-bar">
            <div className="nav-left">
                <span className="nav-name">GGEZ</span>
            </div>
            <div className="nav-right">
                <Stack direction="row" spacing={1}>
                    <Button href="/Login">Login</Button>
                    <Button href="/InvoiceFrom">InvoiceFrom</Button>
                    <Button href="/Invoicetable">PDF</Button>
                    <Button href="/">Home</Button>
                </Stack>
            </div>
        </nav>
    );
}

export default Nav;
