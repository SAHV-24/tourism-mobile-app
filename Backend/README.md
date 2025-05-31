# Tourism REST API

A RESTful API developed with Express.js and Mongoose for the Mobile Development course project, providing tourism-related data management for Colombia, Costa Rica, and Guatemala.

## Requirements

- Node.js 14+
- MongoDB Atlas account
- npm or yarn

## Running with Docker

To run the backend image locally, you must create a `.env` file in the root of the project (or where you run the container) with the following environment variables:

```
NODE_ENV=development
PORT=8080
MONGO_ATLAS_URI=your-mongodb-atlas-uri
JWT_SECRET_KEY=your-very-secret-key
```

- **JWT_SECRET_KEY** must be a strong, random string. It is used to sign and verify JWT tokens for authentication. Do not use simple or predictable values. Example: `2f8e7c1a-4b3d-4e2a-9c7b-1a6e5d2f4b8c`

Then, run the backend image with:

```bash
docker run -p 8080:8080 -d --env-file .env sergioherrera24/mobile-backend:latest
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env` file:
```
MONGO_ATLAS_URI=mongodb+srv://your-connection-string
PORT=8080
NODE_ENV=development
JWT_SECRET_KEY=your-very-secret-key
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

## API Documentation (Swagger)

The API is fully documented using Swagger (OpenAPI 3.0).

- After starting the backend, access the interactive documentation at:

  [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

You can explore all endpoints, see required parameters, try requests, and view example responses directly from the browser.

## API Endpoints

### Countries (CRUD)
- `GET /api/paises` - Get all countries
- `GET /api/paises/:id` - Get country by ID
- `POST /api/paises` - Create new country
- `PUT /api/paises/:id` - Update country
- `DELETE /api/paises/:id` - Delete country

### Cities (CRUD)
- `GET /api/ciudades` - Get all cities
- `GET /api/ciudades/:id` - Get city by ID
- `GET /api/ciudades/pais/:paisId` - Get cities by country
- `POST /api/ciudades` - Create new city
- `PUT /api/ciudades/:id` - Update city
- `DELETE /api/ciudades/:id` - Delete city

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
- `GET /api/platos/ciudad/:ciudadId` - Get dishes by city
- `GET /api/platos/pais/:paisId` - Get dishes by country

### Famous People (Read-only)
- `GET /api/famosos` - Get all famous people
- `GET /api/famosos/:id` - Get famous person by ID
- `GET /api/famosos/pais/:paisId` - Get famous people by country

### Users (CRUD)
- `GET /api/usuarios` - Get all users
- `GET /api/usuarios/:id` - Get user by ID
- `POST /api/usuarios/signup` - Register new user
- `POST /api/usuarios/login` - Authenticate user
- `PUT /api/usuarios/:id` - Update user
- `DELETE /api/usuarios/:id` - Delete user

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
- `POST /api/visitas` - Create new visit
- `PUT /api/visitas/:id` - Update visit
- `DELETE /api/visitas/:id` - Delete visit

### Queries & Statistics
- `GET /api/queries/famosos-mas-taggeados` - Most tagged famous people
- `GET /api/queries/usuarios-mas-visitas` - Users with most visits
- `GET /api/queries/platos-por-ubicacion?paisId=&ciudadId=` - Dishes by country and/or city
- `GET /api/queries/platos-por-usuarios-unicos?n=` - Dishes tagged/visited by more than N unique users
- `GET /api/queries/top-sitios?paisId=` - Top 10 most visited sites by country

## Initial Data

The seed script creates:
- 3 countries: Colombia, Costa Rica, Guatemala
- 30 cities: 10 per country
- 30 tourist sites: 10 per country
- 2 default users

### Default Users
- Administrator: username `admin`, password `admin123`
- Default User: username `juan`, password `123456`

