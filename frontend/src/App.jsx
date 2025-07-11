import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { Box } from '@mui/material';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderHistory from './pages/OrderHistory';
import OrderDetails from './pages/OrderDetails';
import Profile from './pages/Profile';
import CategoryList from './pages/CategoryList';
import CategoryDetail from './pages/CategoryDetail';
import NotFound from './pages/NotFound';
import ClubDetail from './pages/ClubDetail';

// Context providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Protected route component
import PrivateRoute from './components/common/PrivateRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminRoute from './components/admin/AdminRoute';
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import OrderManagement from './pages/admin/OrderManagement';
import UserManagement from './pages/admin/UserManagement';
import ReviewManagement from './pages/admin/ReviewManagement';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main 
                className="main-content" 
                style={{ flex: 1, backgroundColor: '#fff' }}
              >
                <Routes>
                  <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/leagues" element={<CategoryList />} />
                  <Route path="/leagues/:id" element={<CategoryDetail />} />
                  <Route path="/clubs/:id" element={<ClubDetail />} />
                  <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
                  <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
                  <Route path="/checkout/success" element={<PrivateRoute><OrderSuccess /></PrivateRoute>} />
                  <Route path="/orders" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
                  <Route path="/orders/:id" element={<PrivateRoute><OrderDetails /></PrivateRoute>} />
                  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminLayout />
                      </AdminRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="product-management" element={<ProductManagement />} />
                    <Route path="category-management" element={<CategoryManagement />} />
                    <Route path="order-management" element={<OrderManagement />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="review-management" element={<ReviewManagement />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer sx={{ pt: 4 }} />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
