import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CategoryIcon from '@mui/icons-material/Category';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, loading }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="h6" component="div" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      {loading ? (
        <CircularProgress size={20} />
      ) : (
        <Typography variant="h4">{value}</Typography>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!isAdmin) {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching admin stats...');
        const response = await api.get('/admin/stats');
        console.log('Stats response:', response.data);
        if (response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error.response?.data || error.message);
        setError(
          error.response?.data?.message || 
          'Failed to load dashboard stats. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin) {
    return null;
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Products"
            value={stats.products}
            icon={<ShoppingBagIcon color="primary" />}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Users"
            value={stats.users}
            icon={<PeopleIcon color="primary" />}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Orders"
            value={stats.orders}
            icon={<ReceiptIcon color="primary" />}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Categories"
            value={stats.categories}
            icon={<CategoryIcon color="primary" />}
            loading={loading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 