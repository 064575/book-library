// Importovanje potrebnih komponenti i modula
import React from 'react';
import {
  Grid,
  CircularProgress,
  Box,
  Typography,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  SelectChangeEvent
} from '@mui/material';
import BookCard from './BookCard';
import { BookListProps } from '../types';

// BookList komponenta
const BookList: React.FC<BookListProps> = ({
  books,
  loading,
  pagination,
  onPageChange,
  onLimitChange,
  onBookUpdated,
  onBookDeleted,
}) => {
  // Handler za promenu stranice
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
  };

  // Handler za promenu broja knjiga po stranici
  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    onLimitChange(Number(event.target.value));
  };

  // Ako se učitava, prikaži loader
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Ako nema knjiga, prikaži poruku
  if (books.length === 0) {
    return (
      <Box my={4}>
        <Typography variant="h6" align="center" color="textSecondary">
          Nema dostupnih knjiga
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Lista knjiga */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <BookCard
              book={book}
              onUpdate={onBookUpdated}
              onDelete={onBookDeleted}
            />
          </Grid>
        ))}
      </Grid>

      {/* Kontrole za paginaciju */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ mt: 3 }}
      >
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Po stranici</InputLabel>
          <Select<number>
            value={pagination.limit}
            label="Po stranici"
            onChange={handleLimitChange}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>

        <Pagination
          count={pagination.totalPages}
          page={pagination.currentPage}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />

        <Typography variant="body2" color="textSecondary">
          Ukupno: {pagination.total} knjiga
        </Typography>
      </Stack>
    </Box>
  );
};

export default BookList; 