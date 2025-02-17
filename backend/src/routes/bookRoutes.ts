// Importovanje potrebnih modula
import { Router } from 'express';
import multer from 'multer';
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getRecommendations,
  importBooks
} from '../controllers/bookController';

// Kreiranje router instance
const router = Router();

// Podešavanje multera za upload fajlova
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Provera tipa fajla
    if (file.mimetype === 'application/json') {
      cb(null, true);
    } else {
      cb(new Error('Samo JSON fajlovi su dozvoljeni'));
    }
  }
});

// Definisanje ruta

// Ruta za dobijanje svih knjiga
router.get('/', getAllBooks);

// Ruta za dobijanje knjige po ID-u
router.get('/:id', getBookById);

// Ruta za kreiranje nove knjige
router.post('/', createBook);

// Ruta za ažuriranje knjige
router.put('/:id', updateBook);

// Ruta za brisanje knjige
router.delete('/:id', deleteBook);

// Ruta za dobijanje preporuka po žanru
router.get('/recommendations/:genre', getRecommendations);

// Ruta za import knjiga iz JSON fajla
router.post('/import', upload.single('file'), importBooks);

export const bookRoutes = router; 