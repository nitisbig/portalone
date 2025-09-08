import { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';

export default function Verify() {
  const router = useRouter();
  const [message, setMessage] = useState('Verifying...');

  useEffect(() => {
    const hash = router.asPath.split('#')[1];
    if (!hash) {
      setMessage('No verification tokens found.');
      return;
    }
    const params = new URLSearchParams(hash);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(({ error }) => {
          setMessage(error ? 'Verification failed.' : 'Email verified successfully.');
        });
    } else {
      setMessage('Verification failed.');
    }
  }, [router.asPath]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h5" data-testid="verification-message">
        {message}
      </Typography>
    </Container>
  );
}

