# Express MVC App with MongoDB & JWT Authentication

Eine vollständige Express.js REST API mit MVC-Architektur, MongoDB-Datenbank und JWT-Authentifizierung, die in Docker läuft.

## Features

- ✅ **MVC Architecture** - Model, View (API), Controller
- ✅ **MongoDB** - NoSQL Datenbank mit Mongoose ODM
- ✅ **JWT Authentication** - Sichere Token-basierte Authentifizierung
- ✅ **Password Encryption** - Bcrypt für sichere Passwort-Hashes
- ✅ **Input Validation** - Express-validator für Request-Validierung
- ✅ **Docker Support** - Vollständig containerisiert mit Docker Compose
- ✅ **CORS Enabled** - Cross-Origin Resource Sharing aktiviert

## Projektstruktur

```
exp-doc-app/
├── config/
│   └── database.js          # MongoDB Verbindung
├── controllers/
│   ├── authController.js    # Auth-Logik (Register, Login)
│   └── userController.js    # User CRUD-Operationen
├── middleware/
│   └── auth.js              # JWT Authentifizierungs-Middleware
├── models/
│   └── User.js              # User Model (Mongoose Schema)
├── routes/
│   ├── authRoutes.js        # Auth-Routen
│   └── userRoutes.js        # User-Routen
├── .env                     # Umgebungsvariablen
├── .env.example             # Beispiel Umgebungsvariablen
├── app.js                   # Haupt-App-Datei
├── docker-compose.yml       # Docker Compose Konfiguration
├── Dockerfile               # Docker Image Definition
└── package.json             # NPM Dependencies

```

## Voraussetzungen

- Docker & Docker Compose
- Node.js (für lokale Entwicklung)

## Installation & Start

### 1. Environment Variables

Kopiere `.env.example` zu `.env` und passe die Werte an:

```bash
cp .env.example .env
```

**Wichtig:** Ändere `JWT_SECRET` in der `.env` Datei!

### 2. Mit Docker Compose (empfohlen)

```bash
# Build und Start (App + MongoDB)
docker-compose up --build

# Im Hintergrund starten
docker-compose up -d

# Logs anzeigen
docker-compose logs -f

# Stoppen
docker-compose down

# Stoppen und Volumes löschen (Datenbank wird gelöscht!)
docker-compose down -v
```

### 3. Lokale Entwicklung (ohne Docker)

```bash
# Dependencies installieren
npm install

# MongoDB muss lokal laufen
# Dann in .env: MONGO_URI=mongodb://localhost:27017/exp-doc-app

# App starten
npm start
```

## API Endpoints

Siehe [API.md](API.md) für vollständige API-Dokumentation.

### Authentifizierung

- `POST /api/auth/register` - Neuen User registrieren
- `POST /api/auth/login` - User einloggen
- `GET /api/auth/me` - Aktuellen User abrufen (Protected)

### User Management

- `GET /api/users` - Alle Users abrufen (Protected)
- `GET /api/users/:id` - Einzelnen User abrufen (Protected)
- `PUT /api/users/:id` - User aktualisieren (Protected)
- `DELETE /api/users/:id` - User löschen (Protected)

## Beispiel API Calls

### Register

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User (mit Token)

```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## User Model

```javascript
{
  name: String,        // Required, max 50 chars
  email: String,       // Required, unique, valid email
  password: String,    // Required, min 6 chars, hashed with bcrypt
  createdAt: Date,     // Auto-generated
  updatedAt: Date      // Auto-generated
}
```

## Technologie-Stack

- **Express.js** - Web Framework
- **MongoDB** - NoSQL Datenbank
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens für Auth
- **Bcryptjs** - Password Hashing
- **Express-validator** - Input Validation
- **CORS** - Cross-Origin Resource Sharing
- **Dotenv** - Environment Variables
- **Docker** - Containerisierung

## Zugriff

- **API:** http://localhost:4000
- **MongoDB:** localhost:27017 (wenn mit Docker Compose)

## Sicherheit

- Passwörter werden mit bcrypt gehasht (10 Salt Rounds)
- JWT Tokens für sichere Authentifizierung
- Protected Routes mit Middleware
- Input Validation auf allen Endpoints
- CORS aktiviert für Frontend-Integration

## Troubleshooting

### MongoDB Connection Error

Stelle sicher, dass MongoDB läuft:
```bash
docker-compose ps
```

### Port bereits in Verwendung

Ändere den Port in `.env` und `docker-compose.yml`

### JWT Token ungültig

Überprüfe `JWT_SECRET` in `.env` - muss auf Server und Client gleich sein
