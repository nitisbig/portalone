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
  IconButton,
  Avatar,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import supabase from '../lib/supabaseClient';

export default function Notes() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [activeNoteId, setActiveNoteId] = useState(null);
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
      .order('created_at', { ascending: false });
    if (!error) {
      setNotes(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) return;
    if (editingNote) {
      const { data, error } = await supabase
        .from('notes')
        .update({ title, content })
        .eq('id', editingNote.id)
        .select();
      if (error) {
        alert(`Error updating note: ${error.message}`);
        return;
      }
      if (data) {
        setNotes((prev) =>
          prev.map((n) => (n.id === editingNote.id ? data[0] : n))
        );
      }
    } else {
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
      }
    }
    setTitle('');
    setContent('');
    setEditingNote(null);
    setOpen(false);
  };

  const handleOpen = () => {
    setTitle('');
    setContent('');
    setOpen(true);
    setEditingNote(null);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setContent('');
    setEditingNote(null);
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingNote(note);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) {
      alert(`Error deleting note: ${error.message}`);
      return;
    }
    setNotes((prev) => prev.filter((n) => n.id !== id));
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
              <Card
                onMouseEnter={() => setActiveNoteId(note.id)}
                onMouseLeave={() => setActiveNoteId(null)}
                onTouchStart={() => setActiveNoteId(note.id)}
                sx={{ position: 'relative' }}
              >
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
                    {new Date(note.created_at).toLocaleString()}
                  </Typography>
                </CardContent>
                <Box
                  className="note-actions"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1,
                    opacity: activeNoteId === note.id ? 1 : 0,
                    transition: 'opacity 0.3s'
                  }}
                >
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEdit(note)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(note.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
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
          <DialogTitle>{editingNote ? 'Edit Note' : 'Create Note'}</DialogTitle>
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
              {editingNote ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
}

