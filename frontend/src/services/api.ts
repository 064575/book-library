// Importovanje potrebnih modula
import axios from 'axios';
import { Book, ApiResponse } from '../types';

// Bazni URL za API
const API_BASE_URL = 'http://localhost:3000';

// Axios instanca sa podešavanjima
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Funkcija za dobijanje svih knjiga
export const fetchBooks = async (page: number = 1, limit: number = 10): Promise<ApiResponse<Book[]>> => {
  const response = await api.get<ApiResponse<Book[]>>('/books', {
    params: { page, limit }
  });
  return response.data;
};

// Funkcija za dobijanje knjige po ID-u
export const fetchBookById = async (id: number): Promise<Book> => {
  const response = await api.get<ApiResponse<Book>>(`/books/${id}`);
  return response.data.data!;
};

// Funkcija za kreiranje nove knjige
export const createBook = async (book: Omit<Book, 'id'>): Promise<Book> => {
  const response = await api.post<ApiResponse<Book>>('/books', book);
  return response.data.data!;
};

// Funkcija za ažuriranje knjige
export const updateBook = async (id: number, book: Partial<Book>): Promise<Book> => {
  const response = await api.put<ApiResponse<Book>>(`/books/${id}`, book);
  return response.data.data!;
};

// Funkcija za brisanje knjige
export const deleteBook = async (id: number): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/books/${id}`);
};

// Funkcija za dobijanje preporuka po žanru
export const fetchRecommendations = async (genre: string): Promise<Book[]> => {
  const response = await api.get<ApiResponse<Book[]>>(`/books/recommendations/${genre}`);
  return response.data.data || [];
};

// Funkcija za import knjiga iz JSON fajla
export const importBooks = async (file: File): Promise<Book[]> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<ApiResponse<Book[]>>('/books/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data || [];
}; 