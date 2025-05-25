# Tourism REST API

A RESTful API developed with Express.js and Mongoose for the Mobile Development course project, providing tourism-related data management for Colombia, Costa Rica, and Guatemala.

## Requirements

- Node.js 14+
- MongoDB Atlas account
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env` file:
```
MONGO_ATLAS_URI=mongodb+srv://your-connection-string
PORT=8080
```

3. Seed the database:
```bash
npm run seed
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Countries (Read-only)
- `GET /api/paises` - Get all countries
- `GET /api/paises/:id` - Get country by ID

### Cities (Read-only)
- `GET /api/ciudades` - Get all cities
- `GET /api/ciudades/:id` - Get city by ID
- `GET /api/ciudades/pais/:paisId` - Get cities by country

### Sites (CRUD)
- `GET /api/sitios` - Get all sites
- `GET /api/sitios/:id` - Get site by ID
- `GET /api/sitios/pais/:paisId` - Get sites by country
- `POST /api/sitios` - Create new site
- `PUT /api/sitios/:id` - Update site
- `DELETE /api/sitios/:id` - Delete site

### Dishes (Read-only)
- `GET /api/platos` - Get all dishes
- `GET /api/platos/:id` - Get dish by ID
- `GET /api/platos/sitio/:sitioId` - Get dishes by site

### Famous People (Read-only)
- `GET /api/famosos` - Get all famous people
- `GET /api/famosos/:id` - Get famous person by ID
- `GET /api/famosos/pais/:paisId` - Get famous people by country

### Users (CRUD)
- `GET /api/usuarios` - Get all users
- `GET /api/usuarios/:id` - Get user by ID
- `POST /api/usuarios` - Create new user
- `PUT /api/usuarios/:id` - Update user
- `DELETE /api/usuarios/:id` - Delete user
- `POST /api/usuarios/login` - Authenticate user

### Tags (CRUD)
- `GET /api/tags` - Get all tags
- `GET /api/tags/:id` - Get tag by ID
- `GET /api/tags/usuario/:usuarioId` - Get tags by user
- `POST /api/tags` - Create new tag
- `PUT /api/tags/:id` - Update tag
- `DELETE /api/tags/:id` - Delete tag

### Visits (CRUD)
- `GET /api/visitas` - Get all visits
- `GET /api/visitas/:id` - Get visit by ID
- `GET /api/visitas/usuario/:usuarioId` - Get visits by user
- `GET /api/visitas/top-sitios/:paisId` - Get top 10 most visited sites by country
- `POST /api/visitas` - Create new visit
- `PUT /api/visitas/:id` - Update visit
- `DELETE /api/visitas/:id` - Delete visit

## Initial Data

The seed script creates:
- 3 countries: Colombia, Costa Rica, Guatemala
- 30 cities: 10 per country
- 30 tourist sites: 10 per country
- 2 default users

### Default Users
- Administrator: username `admin`, password `admin123`
- Default User: username `juan`, password `123456`

## Project Structure

```
Backend/
├── models/          # Mongoose models
├── routes/          # API routes
├── index.js         # Main server file
├── seed.js          # Database seeding script
├── package.json
└── .env            # Environment variables
```

## Technology Stack

- Express.js: Web framework for Node.js
- Mongoose: MongoDB object modeling
- MongoDB Atlas: Cloud database
- CORS: Cross-origin resource sharing
- dotenv: Environment variable management
