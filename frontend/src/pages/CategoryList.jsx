import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import api from '../services/api';

const CategoryList = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cleanImageUrl = (url) => {
    if (!url) return null;
    // Remove any escaped forward slashes and ensure proper URL format
    const cleaned = url.replace(/\\/g, '');
    return cleaned;
  };

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await api.get('/leagues');
        // Check if response.data is an array or if it's wrapped in a data property
        const leaguesData = Array.isArray(response.data) ? response.data : response.data.data || [];
        // Clean image URLs in the response
        const cleanedLeagues = leaguesData.map(league => ({
          ...league,
          image: cleanImageUrl(league.image)
        }));
        setLeagues(cleanedLeagues);
      } catch (error) {
        setError('Error fetching leagues');
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  // Add a check to ensure leagues is an array before mapping
  if (!Array.isArray(leagues)) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Invalid data format received from server
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Football Leagues
      </Typography>
      {leagues.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No leagues found
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {leagues.map((league) => (
            <Grid item key={league.id} xs={12} sm={6} md={4}>
              <Card 
                component={Link} 
                to={`/leagues/${league.id}`}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  textDecoration: 'none',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out',
                    boxShadow: 3
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={league.image ?
                    (league.image.startsWith('http://') || league.image.startsWith('https://') ?
                      league.image :
                      `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${league.image}`)
                    : 'https://placehold.co/400x200/CCCCCC/666666?text=League+Image'}
                  alt={league.name}
                  sx={{
                    objectFit: 'contain',
                    width: '100%',
                    height: 200,
                    background: '#e0e0e0',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                    p: 0
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {league.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {league.description || 'View all products in this league'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default CategoryList; 