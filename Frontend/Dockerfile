FROM node:20-alpine

WORKDIR /app

# Copiar los archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código (opcional si usas volumen en docker-compose)
COPY . .

# Exponer el puerto por defecto de Angular
EXPOSE 4200

# Comando por defecto: iniciar Angular en modo dev
CMD ["npm", "run", "start"]
