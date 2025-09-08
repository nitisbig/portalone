import { Container, TextField, Button, Box, Typography, Link } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import supabase from '../lib/supabaseClient';

export default function Login() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMessage('User not registered');
      console.error(error.message);
    } else {
      setErrorMessage('');
      router.push('/notes');
    }
  };

  const handleGoogle = async () => {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${origin}/notes` }
    });
    if (error) console.error(error.message);
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Sign in</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth label="Email Address" name="email" autoComplete="email" autoFocus />
          <TextField margin="normal" required fullWidth name="password" label="Password" type="password" autoComplete="current-password" />
          {errorMessage && (
            <Typography color="error" variant="body2">
              {errorMessage}
            </Typography>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Button fullWidth variant="contained" color="primary" startIcon={<GoogleIcon />} onClick={handleGoogle} sx={{ mb: 2 }}>
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
