import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import CartIcon from '../common/CartIcon';
import Tooltip from '@mui/material/Tooltip';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Tooltip title="Go to Home" arrow placement="bottom">
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                width: 'fit-content',
                display: 'inline-block'
              }}
            >
              Alex's Jersey Hub
            </Typography>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Browse All Jerseys" arrow>
          <Button
            color="inherit"
            component={RouterLink}
            to="/products"
          >
            All Jerseys
          </Button>
          </Tooltip>
          <Tooltip title="Browse Leagues" arrow>
          <Button
            color="inherit"
            component={RouterLink}
            to="/leagues"
          >
            Leagues
          </Button>
          </Tooltip>

          {user ? (
            <>
              <CartIcon />
              <Tooltip title="View Profile" arrow>
              <Button
                color="inherit"
                component={RouterLink}
                to="/profile"
              >
                Profile
              </Button>
              </Tooltip>
              <Tooltip title="View Orders" arrow>
              <Button
                color="inherit"
                component={RouterLink}
                to="/orders"
              >
                Orders
              </Button>
              </Tooltip>
              <Tooltip title="Logout" arrow>
              <Button
                color="inherit"
                onClick={handleLogout}
              >
                Logout
              </Button>
              </Tooltip>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
              >
                Login
              </Button>

              <Button
                color="inherit"
                component={RouterLink}
                to="/register"
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 