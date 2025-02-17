// Importovanje potrebnih modula
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { bookRoutes } from './routes/bookRoutes';
import { errorHandler } from './middleware/errorHandler';
import { setupLogger } from './utils/logger';
import { initializeCache } from './utils/cache';
import { initializeWebSocket } from './utils/websocket';

// Učitavanje environment varijabli
dotenv.config();

// Kreiranje Express aplikacije
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Kreiranje HTTP servera
const server = createServer(app);

// Podešavanje loggera
const logger = setupLogger();

// Podešavanje keša
const cache = initializeCache();

// Podešavanje WebSocket servera
initializeWebSocket(server);

// Middleware za parsiranje JSON-a i CORS
app.use(cors());
app.use(express.json());

// Logovanje svih zahteva
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Postavljanje ruta
app.use('/books', bookRoutes);

// Middleware za obradu grešaka
app.use(errorHandler);

// Pokretanje servera
server.listen(PORT, () => {
  logger.info(`Server je pokrenut na portu ${PORT}`);
}); 