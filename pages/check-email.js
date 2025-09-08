import { Container, Typography } from '@mui/material';

export default function CheckEmail() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h5">
        A verification link has been sent to your email address. Please check your inbox.
      </Typography>
    </Container>
  );
}

