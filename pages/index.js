import { Box, Button, Stack, Typography } from '@mui/material';
import NextLink from 'next/link';

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 3,
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
        color: 'common.white',
      }}
    >
      <Typography component="h1" variant="h3" gutterBottom>
        PortalOne Notes
      </Typography>
      <Typography variant="h6" sx={{ mb: 4 }}>
        Capture your thoughts and organize your life
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button component={NextLink} href="/login" variant="contained" color="secondary">
          Log In
        </Button>
        <Button component={NextLink} href="/signup" variant="outlined" color="inherit">
          Sign Up
        </Button>
      </Stack>
    </Box>
  );
}
