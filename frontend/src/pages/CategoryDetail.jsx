import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';

const CategoryDetail = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/categories/${id}`);
        setCategory(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching category:', error);
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!category) {
    return <Typography>Category not found</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        {category.name}
      </Typography>
      <Typography variant="body1" paragraph>
        {category.description}
      </Typography>
      
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Products in this category
      </Typography>
      
      <Grid container spacing={3}>
        {category.products && category.products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardActionArea component={Link} to={`/products/${product.id}`}>
                <CardMedia
                  component="img"
                  height="140"
                  image={product.image || 'https://via.placeholder.com/140'}
                  alt={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    ${product.price}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CategoryDetail; 