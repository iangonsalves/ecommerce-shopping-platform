import React from 'react';
import { Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
 
const CartIcon = () => {
  const { getCartItemsCount, loading } = useCart();

  return (
    <IconButton
      component={Link}
      to="/cart"
      color="inherit"
      aria-label="shopping cart"
      disabled={loading}
    >
      <Badge badgeContent={getCartItemsCount()} color="error">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
};

export default CartIcon; 