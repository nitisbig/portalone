import { Container, TextField, Button, Box, Typography, Link } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import NextLink from 'next/link';

export default function Login() {
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Sign in</Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth label="Email Address" name="email" autoComplete="email" autoFocus />
          <TextField margin="normal" required fullWidth name="password" label="Password" type="password" autoComplete="current-password" />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Button fullWidth variant="contained" color="primary" startIcon={<GoogleIcon />} sx={{ mb: 2 }}>
            Continue with Google
          </Button>
          <Link component={NextLink} href="/signup" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
