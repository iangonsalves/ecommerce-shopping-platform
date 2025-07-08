import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const CategoryDetail = () => {
  const { id } = useParams();
  const [league, setLeague] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart, loading: cartLoading } = useCart();

  useEffect(() => {
    const fetchLeagueAndClubs = async () => {
      try {
        // Fetch league details
        const leagueResponse = await api.get(`/leagues/${id}`);
        // Handle both wrapped and unwrapped responses
        const leagueData = leagueResponse.data.data || leagueResponse.data;
        setLeague(leagueData);

        // Fetch clubs in this league
        const clubsResponse = await api.get(`/leagues/${id}/clubs`);
        // Handle both wrapped and unwrapped responses
        const clubsData = clubsResponse.data.data || clubsResponse.data;
        // Ensure clubs is an array
        setClubs(Array.isArray(clubsData) ? clubsData : []);

        setError('');
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load league data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeagueAndClubs();
  }, [id]);

  const handleAddToCart = async (productId) => {
    const success = await addToCart(productId, 1);
    if (success) {
      // You could add a success message here
    }
  };

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

  if (!league) {
    return (
      <Container>
        <Alert severity="info" sx={{ mt: 2 }}>
          League not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {league.name}
      </Typography>
      
      <Typography variant="body1" paragraph>
        {league.description}
      </Typography>

      {/* Display clubs in this league */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Teams in this League:
        </Typography>
        {clubs.length === 0 ? (
          <Alert severity="info">No teams found in this league</Alert>
        ) : (
          <Grid container spacing={2}>
            {clubs.map((club) => (
              <Grid item xs={12} sm={6} md={4} key={club.id}>
                <Card>
                  <CardActionArea component={Link} to={`/clubs/${club.id}`}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={club.image || club.image_url || 'https://placehold.co/400x200/CCCCCC/666666?text=Club+Image'}
                      alt={club.name}
                    />
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {club.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {club.description || 'View club jerseys'}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default CategoryDetail; 