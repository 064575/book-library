// Importovanje potrebnih tipova
import { Request, Response, NextFunction } from 'express';

// Interfejs za custom error
export interface CustomError extends Error {
  statusCode?: number;
}

// Middleware za obradu grešaka
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Logovanje greške
  console.error('Greška:', err);

  // Podešavanje status koda
  const statusCode = err.statusCode || 500;

  // Slanje odgovora klijentu
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Došlo je do greške na serveru',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
}; 