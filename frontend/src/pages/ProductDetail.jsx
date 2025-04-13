import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Card, CardContent, CardMedia } from '@mui/material';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await axios.get(`http://localhost:8000/api/products/${id}`);
      setProduct(response.data);
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={product.image || 'https://via.placeholder.com/300'}
          alt={product.name}
        />
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          <Typography variant="h5" color="primary">
            ${product.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stock: {product.stock}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductDetail; 