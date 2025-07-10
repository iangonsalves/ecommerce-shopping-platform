import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../../services/api';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image: '',
    sizes: ''
  });

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/product-management');
      if (response.data && response.data.data) {
        setProducts(response.data.data);
        setError('');
      } else {
        setError('Invalid response format from server');
      }
    } catch (error) {
      setError('Failed to fetch products. Please try again.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/category-management');
      if (response.data && response.data.data) {
        setCategories(response.data.data);
      }
    } catch (error) {
      setError('Failed to fetch categories. Please try again.');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleOpen = (product = null) => {
    if (product) {
      let sizes = '';
      if (Array.isArray(product.size_variations)) {
        sizes = product.size_variations.join(', ');
      } else if (typeof product.size_variations === 'string') {
        try {
          const arr = JSON.parse(product.size_variations);
          if (Array.isArray(arr)) {
            sizes = arr.join(', ');
          } else {
            sizes = product.size_variations;
          }
        } catch {
          sizes = product.size_variations;
        }
      }
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category_id: product.category_id,
        image: product.image || '',
        sizes
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        image: '',
        sizes: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        size_variations: formData.sizes
          .split(',')
          .map(s => s.trim())
          .filter(s => s)
      };
      delete payload.sizes;
      if (selectedProduct) {
        await api.put(`/admin/product-management/${selectedProduct.id}`, payload);
      } else {
        await api.post('/admin/product-management', payload);
      }
      handleClose();
      fetchProducts();
    } catch (error) {
      setError('Failed to save product. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/product-management/${id}`);
        fetchProducts();
      } catch (error) {
        setError('Failed to delete product. Please try again.');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Products Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Product
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Sizes</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Club</TableCell>
              <TableCell>League</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const club = product.category;
              const league = categories.find(cat => cat.id === club?.parent_id);
              return (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{(() => {
                    let sizes = product.size_variations;
                    if (Array.isArray(sizes)) {
                      return sizes.join(', ');
                    } else if (typeof sizes === 'string') {
                      try {
                        const arr = JSON.parse(sizes);
                        if (Array.isArray(arr)) {
                          return arr.join(', ');
                        }
                        return sizes;
                      } catch {
                        return sizes;
                      }
                    }
                    return '—';
                  })()}</TableCell>
                  <TableCell>
                    <span className="dirham-symbol">&#xea;</span> {Number(product.price).toFixed(2)}
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{club?.name || '—'}</TableCell>
                  <TableCell>{league ? league.name : '—'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(product)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(product.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedProduct ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="name"
              label="Product Name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              name="price"
              label="Price"
              type="number"
              fullWidth
              value={formData.price}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              name="stock"
              label="Stock"
              type="number"
              fullWidth
              value={formData.stock}
              onChange={handleChange}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Club</InputLabel>
              <Select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                label="Club"
              >
                {categories
                  .filter(cat => cat.parent_id) // Only clubs
                  .map(club => {
                    const league = categories.find(cat2 => cat2.id === club.parent_id);
                    return (
                      <MenuItem key={club.id} value={club.id}>
                        {club.name} {league ? `(${league.name})` : ''}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="image"
              label="Image URL"
              fullWidth
              value={formData.image}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="sizes"
              label="Sizes (comma separated, e.g. S, M, L)"
              fullWidth
              value={formData.sizes}
              onChange={handleChange}
              helperText="Enter sizes separated by commas. Leave blank if not applicable."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedProduct ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProductManagement; 