// Importovanje NodeCache za keširanje
import NodeCache from 'node-cache';

// Definisanje tipova za keš
export interface CacheData {
  books: Book[];
  bookById: { [key: string]: Book };
  recommendations: { [key: string]: Book[] };
}

// Interfejs za knjigu
export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  genre: string;
}

// Kreiranje instance keša
export const initializeCache = () => {
  // Podešavanje vremena isteka keša (u sekundama)
  const cache = new NodeCache({
    stdTTL: 600, // 10 minuta
    checkperiod: 120 // provera isteka svaka 2 minuta
  });

  return {
    // Metoda za čuvanje podataka u kešu
    set: <T>(key: string, value: T): void => {
      cache.set(key, value);
    },

    // Metoda za dobijanje podataka iz keša
    get: <T>(key: string): T | undefined => {
      return cache.get<T>(key);
    },

    // Metoda za brisanje podataka iz keša
    del: (key: string): void => {
      cache.del(key);
    },

    // Metoda za brisanje celog keša
    flush: (): void => {
      cache.flushAll();
    }
  };
}; 