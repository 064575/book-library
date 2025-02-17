// Importovanje Winston loggera
import winston from 'winston';

// Kreiranje i podešavanje loggera
export const setupLogger = () => {
  return winston.createLogger({
    // Definisanje formata logova
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    // Definisanje transporta (gde će se čuvati logovi)
    transports: [
      // Logovanje u konzolu
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
      // Logovanje u fajl
      new winston.transports.File({ 
        filename: 'logs/error.log', 
        level: 'error' 
      }),
      new winston.transports.File({ 
        filename: 'logs/combined.log' 
      })
    ]
  });
}; 