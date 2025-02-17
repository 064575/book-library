// Importovanje potrebnih komponenti i modula
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { createBook, updateBook } from '../services/api';
import { BookFormProps } from '../types';

// BookForm komponenta
const BookForm: React.FC<BookFormProps> = ({
  book,
  onBookAdded,
  onCancel,
}) => {
  // State za formu
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    year: book?.year || new Date().getFullYear(),
    genre: book?.genre || '',
  });

  // State za greške
  const [errors, setErrors] = useState({
    title: false,
    author: false,
    year: false,
    genre: false,
  });

  // Funkcija za promenu polja
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Resetovanje greške za polje
    setErrors(prev => ({
      ...prev,
      [name]: false,
    }));
  };

  // Funkcija za validaciju forme
  const validateForm = () => {
    const newErrors = {
      title: !formData.title,
      author: !formData.author,
      year: !formData.year || formData.year < 0,
      genre: !formData.genre,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  // Funkcija za slanje forme
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (book) {
        // Ažuriranje postojeće knjige
        await updateBook(book.id, formData);
      } else {
        // Kreiranje nove knjige
        await createBook(formData);
      }
      onBookAdded();
    } catch (error) {
      console.error('Greška pri čuvanju knjige:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <DialogTitle>
        {book ? 'Izmeni knjigu' : 'Dodaj novu knjigu'}
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Naslov"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          helperText={errors.title && 'Naslov je obavezan'}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Autor"
          name="author"
          value={formData.author}
          onChange={handleChange}
          error={errors.author}
          helperText={errors.author && 'Autor je obavezan'}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Godina"
          name="year"
          type="number"
          value={formData.year}
          onChange={handleChange}
          error={errors.year}
          helperText={errors.year && 'Unesite validnu godinu'}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Žanr"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          error={errors.genre}
          helperText={errors.genre && 'Žanr je obavezan'}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Otkaži</Button>
        <Button type="submit" variant="contained" color="primary">
          {book ? 'Sačuvaj' : 'Dodaj'}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default BookForm; 