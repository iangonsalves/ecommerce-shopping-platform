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
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../services/api';

const CategoryDetail = () => {
  const { id } = useParams();
  const [league, setLeague] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const cleanImageUrl = (url) => {
    if (!url) return null;
    // Remove any escaped forward slashes and ensure proper URL format
    const cleaned = url.replace(/\\/g, '');
    return cleaned;
  };

  // Prepare clubs with cleaned image URLs
  const clubsWithCleanImages = clubs.map(club => ({
    ...club,
    image: cleanImageUrl(club.image),
    image_url: cleanImageUrl(club.image_url)
  }));

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
      {/* Display clubs in this league */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Teams in this League:
        </Typography>
        {clubsWithCleanImages.length === 0 ? (
          <Alert severity="info">No teams found in this league</Alert>
        ) : (
          <Grid container spacing={2}>
            {clubsWithCleanImages.map((club) => (
              <Grid item xs={12} sm={6} md={4} key={club.id}>
                <Card>
                  <CardActionArea component={Link} to={`/clubs/${club.id}`}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={club.image ?
                        (club.image.startsWith('http://') || club.image.startsWith('https://') ?
                          club.image :
                          `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${club.image}`)
                        : (club.image_url ?
                          (club.image_url.startsWith('http://') || club.image_url.startsWith('https://') ?
                            club.image_url :
                            `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${club.image_url}`)
                          : 'https://placehold.co/400x200/CCCCCC/666666?text=Club+Image')}
                      alt={club.name}
                      sx={{
                        objectFit: 'contain',
                        width: '100%',
                        height: 200,
                        background: '#181818',
                        borderTopLeftRadius: '16px',
                        borderTopRightRadius: '16px',
                        p: 0
                      }}
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