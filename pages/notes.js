import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText
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
    const { error } = await supabase.from('notes').insert({
      user_id: session.user.id,
      title,
      content
    });
    if (!error) {
      setTitle('');
      setContent('');
      fetchNotes();
    }
  };

  return (
    <Container maxWidth="sm">
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
        <List>
          {notes.map((note) => (
            <ListItem key={note.id} alignItems="flex-start">
              <ListItemText primary={note.title} secondary={note.content} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}

