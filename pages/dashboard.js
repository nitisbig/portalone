import { Typography, Container, Box } from '@mui/material';

export default function Dashboard() {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          User Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome to your dashboard.
        </Typography>
      </Box>
    </Container>
  );
}
