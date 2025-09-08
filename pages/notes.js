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
  CardContent
} from '@mui/material';
import supabase from '../lib/supabaseClient';

export default function Notes() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

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
      .order('id', { ascending: false });
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
        content
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
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          My Notes
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
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
          <Button type="submit" variant="contained">
            Add Note
          </Button>
        </Box>
        <Grid container spacing={2}>
          {notes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {note.title}
                  </Typography>
                  <Typography variant="body2">{note.content}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

