import React, { useState, useEffect } from 'react';
import { Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
 
const CartIcon = () => {
  const { cart } = useCart();
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    // Calculate total quantity from all items in the cart
    const calculateTotalQuantity = () => {
      if (!cart || !cart.items || cart.items.length === 0) {
        return 0;
      }
      return cart.items.reduce((total, item) => total + (item.quantity || 0), 0);
    };

    const newTotalQuantity = calculateTotalQuantity();
    setItemCount(newTotalQuantity);
    
    // Optional: Log changes for debugging
    // console.log('Cart changed, new total quantity:', newTotalQuantity, cart);

  }, [cart]); // Dependency array ensures this runs whenever 'cart' object changes

  return (
    <IconButton
      component={Link}
      to="/cart"
      color="inherit"
      aria-label="shopping cart"
    >
      <Badge badgeContent={itemCount} color="error">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
};

export default CartIcon; 