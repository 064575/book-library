// Importovanje potrebnih modula i tipova
import { Request, Response, NextFunction } from 'express';
import { Book } from '../utils/cache';
import fs from 'fs/promises';
import path from 'path';
import { initializeCache } from '../utils/cache';
import { broadcastMessage } from '../utils/websocket';

// Inicijalizacija keša
const cache = initializeCache();

// Putanja do JSON fajla sa knjigama
const booksFilePath = path.join(__dirname, '../data/books.json');

// Pomoćna funkcija za čitanje knjiga iz fajla
const readBooksFromFile = async (): Promise<Book[]> => {
  try {
    const data = await fs.readFile(booksFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Ako fajl ne postoji, vraćamo prazan niz
    return [];
  }
};

// Pomoćna funkcija za čuvanje knjiga u fajl
const saveBooksToFile = async (books: Book[]): Promise<void> => {
  await fs.writeFile(booksFilePath, JSON.stringify(books, null, 2));
};

// Kontroler za dobijanje svih knjiga
export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    // Prvo proveravamo keš
    let books = cache.get<Book[]>('books');
    
    if (!books) {
      // Ako nema u kešu, čitamo iz fajla
      books = await readBooksFromFile();
      // Čuvamo u keš
      cache.set('books', books);
    }

    // Implementacija paginacije
    const totalBooks = books.length;
    const totalPages = Math.ceil(totalBooks / limit);
    const paginatedBooks = books.slice(offset, offset + limit);

    res.json({ 
      success: true, 
      data: paginatedBooks,
      pagination: {
        total: totalBooks,
        totalPages,
        currentPage: page,
        limit,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// Kontroler za dobijanje knjige po ID-u
export const getBookById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const books = await readBooksFromFile();
    const book = books.find(b => b.id === parseInt(id));

    if (!book) {
      return res.status(404).json({ 
        success: false, 
        error: 'Knjiga nije pronađena' 
      });
    }

    res.json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

// Kontroler za kreiranje nove knjige
export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await readBooksFromFile();
    const newBook: Book = {
      id: books.length ? Math.max(...books.map(b => b.id)) + 1 : 1,
      ...req.body
    };

    books.push(newBook);
    await saveBooksToFile(books);
    
    // Ažuriramo keš
    cache.del('books');
    
    // Šaljemo WebSocket poruku
    broadcastMessage({
      type: 'bookAdded',
      data: newBook
    });

    res.status(201).json({ success: true, data: newBook });
  } catch (error) {
    next(error);
  }
};

// Kontroler za ažuriranje knjige
export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    let books = await readBooksFromFile();
    const index = books.findIndex(b => b.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Knjiga nije pronađena' 
      });
    }

    const updatedBook = { ...books[index], ...req.body };
    books[index] = updatedBook;
    await saveBooksToFile(books);
    
    // Ažuriramo keš
    cache.del('books');

    // Šaljemo WebSocket poruku
    broadcastMessage({
      type: 'bookUpdated',
      data: updatedBook
    });

    res.json({ success: true, data: updatedBook });
  } catch (error) {
    next(error);
  }
};

// Kontroler za brisanje knjige
export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const bookId = parseInt(id);
    let books = await readBooksFromFile();
    const filteredBooks = books.filter(b => b.id !== bookId);

    if (filteredBooks.length === books.length) {
      return res.status(404).json({ 
        success: false, 
        error: 'Knjiga nije pronađena' 
      });
    }

    await saveBooksToFile(filteredBooks);
    
    // Ažuriramo keš
    cache.del('books');

    // Šaljemo WebSocket poruku
    broadcastMessage({
      type: 'bookDeleted',
      data: bookId
    });

    res.json({ success: true, message: 'Knjiga je uspešno obrisana' });
  } catch (error) {
    next(error);
  }
};

// Kontroler za dobijanje preporuka po žanru
export const getRecommendations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { genre } = req.params;
    const books = await readBooksFromFile();
    const recommendations = books.filter(b => 
      b.genre.toLowerCase() === genre.toLowerCase()
    );

    res.json({ success: true, data: recommendations });
  } catch (error) {
    next(error);
  }
};

// Kontroler za import knjiga iz JSON fajla
export const importBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'Fajl nije priložen' 
      });
    }

    const importedBooks = JSON.parse(req.file.buffer.toString());
    const existingBooks = await readBooksFromFile();
    
    // Dodeljujemo nove ID-eve importovanim knjigama
    const maxId = existingBooks.length ? Math.max(...existingBooks.map(b => b.id)) : 0;
    const booksToAdd = importedBooks.map((book: Omit<Book, 'id'>, index: number) => ({
      ...book,
      id: maxId + index + 1
    }));

    const updatedBooks = [...existingBooks, ...booksToAdd];
    await saveBooksToFile(updatedBooks);
    
    // Ažuriramo keš
    cache.del('books');

    res.json({ 
      success: true, 
      message: `Uspešno importovano ${booksToAdd.length} knjiga`,
      data: booksToAdd 
    });
  } catch (error) {
    next(error);
  }
}; 