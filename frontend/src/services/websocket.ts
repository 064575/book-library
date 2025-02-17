import { Book } from '../types';

// Tip za WebSocket poruke
type WebSocketMessage = {
  type: 'bookAdded' | 'bookUpdated' | 'bookDeleted';
  data: Book | number;
};

// Tip za callback funkcije
type WebSocketCallbacks = {
  onBookAdded: (book: Book) => void;
  onBookUpdated: (book: Book) => void;
  onBookDeleted: (bookId: number) => void;
};

let ws: WebSocket | null = null;

// Funkcija za inicijalizaciju WebSocket konekcije
export const initializeWebSocket = (callbacks: WebSocketCallbacks) => {
  if (ws) {
    ws.close();
  }

  ws = new WebSocket('ws://localhost:3000');

  ws.onopen = () => {
    console.log('WebSocket connection established');
  };

  ws.onmessage = (event) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);

      switch (message.type) {
        case 'bookAdded':
          callbacks.onBookAdded(message.data as Book);
          break;
        case 'bookUpdated':
          callbacks.onBookUpdated(message.data as Book);
          break;
        case 'bookDeleted':
          callbacks.onBookDeleted(message.data as number);
          break;
        default:
          console.warn('Unknown message type:', message);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
    // Pokušaj ponovnog povezivanja nakon 5 sekundi
    setTimeout(() => initializeWebSocket(callbacks), 5000);
  };

  return () => {
    if (ws) {
      ws.close();
    }
  };
}; 