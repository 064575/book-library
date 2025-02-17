import WebSocket from 'ws';
import { Server } from 'http';
import { Book } from './cache';

let wss: WebSocket.Server;

// Tip za WebSocket poruke
export type WebSocketMessage = {
  type: 'bookAdded' | 'bookUpdated' | 'bookDeleted';
  data: Book | number; // Book za add/update, number (id) za delete
};

// Inicijalizacija WebSocket servera
export const initializeWebSocket = (server: Server) => {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
};

// Funkcija za slanje poruke svim klijentima
export const broadcastMessage = (message: WebSocketMessage) => {
  if (!wss) {
    console.error('WebSocket server not initialized');
    return;
  }

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}; 