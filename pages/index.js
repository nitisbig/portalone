import { Container, Typography, Link } from '@mui/material';
import NextLink from 'next/link';

export default function Home() {
  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>Welcome to PortalOne</Typography>
      <Link component={NextLink} href="/login" underline="hover">
        Go to Login
      </Link>
    </Container>
  );
}
