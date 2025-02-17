
## Uputstvo za pokretanje

Postoje dva načina za pokretanje projekta: direktno korišćenje npm komandi ili korišćenje Docker-a.

### Opcija 1: Pokretanje bez Docker-a

1. **Pokretanje backend-a:**
   - Otvorite terminal i navigirajte do `backend` direktorijuma:
     ```bash
     cd backend
     ```
   - Instalirajte potrebne zavisnosti:
     ```bash
     npm install
     ```
   - Pokrenite development server:
     ```bash
     npm run dev
     ```

2. **Pokretanje frontend-a:**
   - U drugom terminalu, navigirajte do `frontend` direktorijuma:
     ```bash
     cd frontend
     ```
   - Instalirajte potrebne zavisnosti:
     ```bash
     npm install
     ```
   - Pokrenite frontend aplikaciju:
     ```bash
     npm start
     ```

### Opcija 2: Pokretanje sa Docker-om

1. **Pokretanje projekta koristeći Docker:**
   - Otvorite terminal u root direktorijumu projekta.
   - Pokrenite Docker kontejnere:
     ```bash
     docker-compose up -d
     ```

   Ova komanda će pokrenuti sve potrebne servise definisane u `docker-compose.yml` fajlu.