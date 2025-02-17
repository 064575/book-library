// Importovanje potrebnih komponenti i modula
import React, { useState, useEffect } from 'react';
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import FileUpload from './components/FileUpload';
import { Book, Pagination } from './types';
import { fetchBooks } from './services/api';
import { initializeWebSocket } from './services/websocket';

// Kreiranje teme za Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Inicijalno stanje paginacije
const initialPagination: Pagination = {
  total: 0,
  totalPages: 0,
  currentPage: 1,
  limit: 10,
  hasNext: false,
  hasPrevious: false,
};

// Glavna App komponenta
const App: React.FC = () => {
  // State za knjige
  const [books, setBooks] = useState<Book[]>([]);
  // State za učitavanje
  const [loading, setLoading] = useState(true);
  // State za paginaciju
  const [pagination, setPagination] = useState<Pagination>(initialPagination);
  // State za notifikacije
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    type: 'info',
  });

  // Učitavanje knjiga
  const loadBooks = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      const response = await fetchBooks(page, limit);
      setBooks(response.data || []);
      setPagination(response.pagination || initialPagination);
    } catch (error) {
      console.error('Greška pri učitavanju knjiga:', error);
      showNotification('Greška pri učitavanju knjiga', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Funkcija za prikazivanje notifikacija
  const showNotification = (message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    setNotification({
      open: true,
      message,
      type,
    });
  };

  // Zatvaranje notifikacije
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // WebSocket handlers
  const handleBookAdded = (newBook: Book) => {
    showNotification('Nova knjiga je dodata', 'success');
    loadBooks(pagination.currentPage, pagination.limit);
  };

  const handleBookUpdated = (updatedBook: Book) => {
    showNotification('Knjiga je ažurirana', 'info');
    loadBooks(pagination.currentPage, pagination.limit);
  };

  const handleBookDeleted = (bookId: number) => {
    showNotification('Knjiga je obrisana', 'warning');
    loadBooks(pagination.currentPage, pagination.limit);
  };

  // Učitavanje knjiga pri prvom renderovanju i inicijalizacija WebSocket-a
  useEffect(() => {
    loadBooks(pagination.currentPage, pagination.limit);

    // Inicijalizacija WebSocket konekcije
    const cleanup = initializeWebSocket({
      onBookAdded: handleBookAdded,
      onBookUpdated: handleBookUpdated,
      onBookDeleted: handleBookDeleted,
    });

    // Cleanup pri unmount-u
    return cleanup;
  }, []);

  // Handler za promenu stranice
  const handlePageChange = (page: number) => {
    loadBooks(page, pagination.limit);
  };

  // Handler za promenu broja knjiga po stranici
  const handleLimitChange = (limit: number) => {
    loadBooks(1, limit);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Biblioteka Knjiga
          </Typography>
          
          {/* Forma za dodavanje nove knjige */}
          <BookForm onBookAdded={() => loadBooks(pagination.currentPage, pagination.limit)} />
          
          {/* Komponenta za upload JSON fajla */}
          <FileUpload onUploadSuccess={() => loadBooks(pagination.currentPage, pagination.limit)} />
          
          {/* Lista knjiga */}
          <BookList 
            books={books} 
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            onBookUpdated={() => loadBooks(pagination.currentPage, pagination.limit)}
            onBookDeleted={() => loadBooks(pagination.currentPage, pagination.limit)}
          />

          {/* Notifikacije */}
          <Snackbar
            open={notification.open}
            autoHideDuration={3000}
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert 
              onClose={handleCloseNotification} 
              severity={notification.type}
              variant="filled"
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App; 