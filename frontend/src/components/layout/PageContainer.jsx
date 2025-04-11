import { Container, Box, Paper } from '@mui/material';

const PageContainer = ({ children, maxWidth = 'xs' }) => {
  return (
    <Container component="main" maxWidth={maxWidth}>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          {children}
        </Paper>
      </Box>
    </Container>
  );
};

export default PageContainer; 