import { Container, TextField, Button, Box, Typography, Link } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';

export default function SignUp() {
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    const name = data.get('name');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    if (error) {
      console.error(error.message);
    } else {
      router.push('/');
    }
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) console.error(error.message);
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Sign up</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth label="Name" name="name" autoFocus />
          <TextField margin="normal" required fullWidth label="Email Address" name="email" autoComplete="email" />
          <TextField margin="normal" required fullWidth name="password" label="Password" type="password" autoComplete="new-password" />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          <Button fullWidth variant="contained" color="primary" startIcon={<GoogleIcon />} onClick={handleGoogle} sx={{ mb: 2 }}>
            Continue with Google
          </Button>
          <Link component={NextLink} href="/login" variant="body2">
            {"Already have an account? Sign In"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
