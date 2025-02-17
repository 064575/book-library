// Importovanje potrebnih komponenti i modula
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Dialog,
} from '@mui/material';
import { deleteBook } from '../services/api';
import BookForm from './BookForm';
import { BookCardProps } from '../types';

// BookCard komponenta
const BookCard: React.FC<BookCardProps> = ({ book, onUpdate, onDelete }) => {
  // State za dijalog za izmenu
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Funkcija za brisanje knjige
  const handleDelete = async () => {
    try {
      await deleteBook(book.id);
      onDelete();
    } catch (error) {
      console.error('Greška pri brisanju knjige:', error);
    }
  };

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {book.title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Autor: {book.author}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Godina: {book.year}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Žanr: {book.genre}
          </Typography>
        </CardContent>
        <CardActions>
          <Button 
            size="small" 
            color="primary" 
            onClick={() => setIsEditDialogOpen(true)}
          >
            Izmeni
          </Button>
          <Button 
            size="small" 
            color="secondary" 
            onClick={handleDelete}
          >
            Obriši
          </Button>
        </CardActions>
      </Card>

      {/* Dijalog za izmenu knjige */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <BookForm
          book={book}
          onBookAdded={async () => {
            await onUpdate();
            setIsEditDialogOpen(false);
          }}
          onCancel={() => setIsEditDialogOpen(false)}
        />
      </Dialog>
    </>
  );
};

export default BookCard; 