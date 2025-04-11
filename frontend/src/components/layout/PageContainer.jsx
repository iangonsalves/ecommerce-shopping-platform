import { Container, Box, Paper } from '@mui/material';

const PageContainer = ({ children, maxWidth = 'xs' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
        width: '100%',
      }}
    >
      <Container 
        component="main" 
        maxWidth={maxWidth} 
        sx={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%',
            maxWidth: maxWidth === 'xs' ? '400px' : 'none'
          }}
        >
          {children}
        </Paper>
      </Container>
    </Box>
  );
};

export default PageContainer; 