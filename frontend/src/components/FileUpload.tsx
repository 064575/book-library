// Importovanje potrebnih komponenti i modula
import React, { useRef, useState } from 'react';
import {
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { importBooks } from '../services/api';
import { FileUploadProps } from '../types';

// FileUpload komponenta
const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  // Reference za input element
  const fileInputRef = useRef<HTMLInputElement>(null);
  // State za učitavanje
  const [loading, setLoading] = useState(false);
  // State za poruku o grešci
  const [error, setError] = useState<string | null>(null);
  // State za poruku o uspehu
  const [success, setSuccess] = useState(false);

  // Funkcija za otvaranje dijaloga za izbor fajla
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Funkcija za obradu izabranog fajla
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Provera tipa fajla
    if (file.type !== 'application/json') {
      setError('Molimo vas izaberite JSON fajl');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await importBooks(file);
      setSuccess(true);
      onUploadSuccess();
      // Resetovanje input polja
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('Greška pri učitavanju fajla. Proverite format JSON-a.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ my: 3 }}>
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Box display="flex" alignItems="center" gap={2}>
        <Button
          variant="contained"
          onClick={handleButtonClick}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Učitaj knjige iz JSON fajla'
          )}
        </Button>
        <Typography variant="body2" color="textSecondary">
          Izaberite JSON fajl sa knjigama za import
        </Typography>
      </Box>

      {/* Prikaz poruke o grešci */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Prikaz poruke o uspehu */}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Knjige su uspešno učitane!
        </Alert>
      )}
    </Box>
  );
};

export default FileUpload; 