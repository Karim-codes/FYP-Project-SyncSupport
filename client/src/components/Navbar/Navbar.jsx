import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import './Navbar.scss';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountMenuAnchorEl, setAccountMenuAnchorEl] = useState(null);
  const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'));
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleAccountMenuClick = (event) => {
    setAccountMenuAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchorEl(null);
  };

  const handleLogout = () => {
    // Logic for logging out the user
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const menuItems = (
    <div className="menu-items">
      <Link to="/" className="menu-link">Home</Link>
      <Link to="/about-us" className="menu-link">About Us</Link>
    </div>
  );

  return (
    <AppBar position="static" style={{ backgroundColor: '#000000' }}>
      <Toolbar className="navbar-toolbar">
        {isMobile ? (
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
        ) : (
          <>
            <Link to="/" className="navbar-logo">SyncSupport</Link>
            {menuItems}
          </>
        )}

        <div className="navbar-account">
          <IconButton
            edge="end"
            color="inherit"
            aria-label="account"
            aria-controls="account-menu"
            aria-haspopup="true"
            onClick={handleAccountMenuClick}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="account-menu"
            anchorEl={accountMenuAnchorEl}
            keepMounted
            open={Boolean(accountMenuAnchorEl)}
            onClose={handleAccountMenuClose}
          >
            {localStorage.getItem('authToken') ? (
              <MenuItem onClick={() => { handleAccountMenuClose(); handleLogout(); }}>Logout</MenuItem>
            ) : (
              <>
                <MenuItem onClick={() => { handleAccountMenuClose(); navigate('/login'); }}>Login</MenuItem>
                <MenuItem onClick={() => { handleAccountMenuClose(); navigate('/signup'); }}>Sign Up</MenuItem>
              </>
            )}
          </Menu>
        </div>
      </Toolbar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <div
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem button component={Link} to="/">
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/about-us">
              <ListItemText primary="About Us" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
