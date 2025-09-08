import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import supabase from '../lib/supabaseClient';

export default function Notes() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(false);
  const userName =
    session?.user?.user_metadata?.name ||
    session?.user?.email?.split('@')[0] ||
    '';

  useEffect(() => {
    const init = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setSession(session);
      fetchNotes(session);
    };
    init();
  }, [router]);

  const fetchNotes = async (currentSession = session) => {
    if (!currentSession) return;
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', currentSession.user.id)
      .order('createdon', { ascending: false });
    if (!error) {
      setNotes(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) return;
    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: session.user.id,
        title,
        content,
        createdon: new Date().toISOString()
      })
      .select();
    if (error) {
      alert(`Error saving note: ${error.message}`);
      return;
    }
    if (data) {
      setNotes((prev) => [...data, ...prev]);
      setTitle('');
      setContent('');
      setOpen(false);
    }
  };

  const handleOpen = () => {
    setTitle('');
    setContent('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 4
          }}
        >
          <Avatar
            alt={userName}
            src={session?.user?.user_metadata?.avatar_url}
            sx={{ width: 56, height: 56 }}
          />
          <Typography component="h1" variant="h4">
            {`Hello ${userName}`}
          </Typography>
        </Box>
        <Typography component="h2" variant="h5" gutterBottom>
          My Notes
        </Typography>
        <Grid container spacing={2}>
          {notes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {note.title}
                  </Typography>
                  <Typography variant="body2">{note.content}</Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mt: 1 }}
                  >
                    {new Date(note.createdon).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleOpen}
        aria-label="add"
      >
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>Create Note</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextField
              label="Content"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Create
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
}

