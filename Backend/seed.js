require("dotenv").config();
const mongoose = require("mongoose");

// Importar modelos
const Pais = require("./models/Pais");
const Ciudad = require("./models/Ciudad");
const Sitio = require("./models/Sitio");
const Plato = require("./models/Plato");
const Famoso = require("./models/Famoso");
const Usuario = require("./models/Usuario");

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_ATLAS_URI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

const poblarBaseDatos = async () => {
  try {
    // Limpiar datos existentes
    await Promise.all([
      Pais.deleteMany({}),
      Ciudad.deleteMany({}),
      Sitio.deleteMany({}),
      Plato.deleteMany({}),
      Famoso.deleteMany({}),
      Usuario.deleteMany({}),
    ]);

    console.log("🧹 Datos existentes eliminados");

    // Crear países
    const paises = await Pais.insertMany([
      { nombre: "Colombia" },
      { nombre: "Costa Rica" },
      { nombre: "Guatemala" },
    ]);

    console.log("🗺️ Países creados:", paises.length); // Crear ciudades para cada país
    const ciudadesColombia = await Ciudad.insertMany([
      { nombre: "Bogotá", pais: paises[0]._id },
      { nombre: "Medellín", pais: paises[0]._id },
      { nombre: "Cali", pais: paises[0]._id },
      { nombre: "Barranquilla", pais: paises[0]._id },
      { nombre: "Cartagena", pais: paises[0]._id },
      { nombre: "Bucaramanga", pais: paises[0]._id },
      { nombre: "Cúcuta", pais: paises[0]._id },
      { nombre: "Pereira", pais: paises[0]._id },
      { nombre: "Manizales", pais: paises[0]._id },
      { nombre: "Santa Marta", pais: paises[0]._id },
    ]);

    const ciudadesCostaRica = await Ciudad.insertMany([
      { nombre: "San José", pais: paises[1]._id },
      { nombre: "Alajuela", pais: paises[1]._id },
      { nombre: "Cartago", pais: paises[1]._id },
      { nombre: "Heredia", pais: paises[1]._id },
      { nombre: "Puntarenas", pais: paises[1]._id },
      { nombre: "Limón", pais: paises[1]._id },
      { nombre: "Liberia", pais: paises[1]._id },
      { nombre: "Nicoya", pais: paises[1]._id },
      { nombre: "San Carlos", pais: paises[1]._id },
      { nombre: "Grecia", pais: paises[1]._id },
    ]);

    const ciudadesGuatemala = await Ciudad.insertMany([
      { nombre: "Ciudad de Guatemala", pais: paises[2]._id },
      { nombre: "Mixco", pais: paises[2]._id },
      { nombre: "Villa Nueva", pais: paises[2]._id },
      { nombre: "Quetzaltenango", pais: paises[2]._id },
      { nombre: "Escuintla", pais: paises[2]._id },
      { nombre: "Chimaltenango", pais: paises[2]._id },
      { nombre: "Huehuetenango", pais: paises[2]._id },
      { nombre: "Cobán", pais: paises[2]._id },
      { nombre: "Mazatenango", pais: paises[2]._id },
      { nombre: "Puerto Barrios", pais: paises[2]._id },
    ]);

    console.log(
      "🏙️ Ciudades creadas:",
      ciudadesColombia.length +
        ciudadesCostaRica.length +
        ciudadesGuatemala.length
    );

    // Crear sitios para Colombia
    const sitiosColombia = await Sitio.insertMany([
      {
        nombre: "Museo del Oro",
        ubicacion: "Centro Histórico",
        ciudad: ciudadesColombia[0]._id,
        tipoSitio: "Museo",
      },
      {
        nombre: "Zona Rosa",
        ubicacion: "Chapinero",
        ciudad: ciudadesColombia[0]._id,
        tipoSitio: "Centro Comercial",
      },
      {
        nombre: "Comuna 13",
        ubicacion: "San Javier",
        ciudad: ciudadesColombia[1]._id,
        tipoSitio: "Atracción Turística",
      },
      {
        nombre: "Pueblito Paisa",
        ubicacion: "Cerro Nutibara",
        ciudad: ciudadesColombia[1]._id,
        tipoSitio: "Atracción Turística",
      },
      {
        nombre: "Zoológico de Cali",
        ubicacion: "Santa Teresita",
        ciudad: ciudadesColombia[2]._id,
        tipoSitio: "Atracción Turística",
      },
      {
        nombre: "Teatro Municipal",
        ubicacion: "Centro",
        ciudad: ciudadesColombia[2]._id,
        tipoSitio: "Teatro",
      },
      {
        nombre: "Malecón",
        ubicacion: "Centro",
        ciudad: ciudadesColombia[3]._id,
        tipoSitio: "Atracción Turística",
      },
      {
        nombre: "Ciudad Amurallada",
        ubicacion: "Centro Histórico",
        ciudad: ciudadesColombia[4]._id,
        tipoSitio: "Monumento",
      },
      {
        nombre: "Parque Arboleda",
        ubicacion: "Cuba",
        ciudad: ciudadesColombia[5]._id,
        tipoSitio: "Parque",
      },
      {
        nombre: "Quinta de San Pedro Alejandrino",
        ubicacion: "Mamatoco",
        ciudad: ciudadesColombia[6]._id,
        tipoSitio: "Museo",
      },
    ]); // Crear sitios para Costa Rica
    const sitiosCostaRica = await Sitio.insertMany([
      {
        nombre: "Teatro Nacional",
        ubicacion: "Centro",
        ciudad: ciudadesCostaRica[0]._id,
        tipoSitio: "Teatro",
      },
      {
        nombre: "Mercado Central",
        ubicacion: "Centro",
        ciudad: ciudadesCostaRica[0]._id,
        tipoSitio: "Centro Comercial",
      },
      {
        nombre: "Aeropuerto Juan Santamaría",
        ubicacion: "Rio Segundo",
        ciudad: ciudadesCostaRica[1]._id,
        tipoSitio: "Otro",
      },
      {
        nombre: "Basílica de los Ángeles",
        ubicacion: "Centro",
        ciudad: ciudadesCostaRica[2]._id,
        tipoSitio: "Monumento",
      },
      {
        nombre: "Universidad Nacional",
        ubicacion: "Centro",
        ciudad: ciudadesCostaRica[3]._id,
        tipoSitio: "Otro",
      },
      {
        nombre: "Puerto Caldera",
        ubicacion: "Caldera",
        ciudad: ciudadesCostaRica[4]._id,
        tipoSitio: "Atracción Turística",
      },
      {
        nombre: "Puerto Limón",
        ubicacion: "Centro",
        ciudad: ciudadesCostaRica[5]._id,
        tipoSitio: "Atracción Turística",
      },
      {
        nombre: "Parque Nacional Guanacaste",
        ubicacion: "Centro",
        ciudad: ciudadesCostaRica[6]._id,
        tipoSitio: "Parque",
      },
      {
        nombre: "Parque Central Nicoya",
        ubicacion: "Centro",
        ciudad: ciudadesCostaRica[7]._id,
        tipoSitio: "Parque",
      },
      {
        nombre: "Plaza Central Grecia",
        ubicacion: "Centro",
        ciudad: ciudadesCostaRica[9]._id,
        tipoSitio: "Centro Comercial",
      },
    ]); // Crear sitios para Guatemala
    const sitiosGuatemala = await Sitio.insertMany([
      {
        nombre: "Palacio Nacional",
        ubicacion: "Centro Histórico",
        ciudad: ciudadesGuatemala[0]._id,
        tipoSitio: "Monumento",
      },
      {
        nombre: "Zona Viva",
        ubicacion: "Zona 10",
        ciudad: ciudadesGuatemala[0]._id,
        tipoSitio: "Centro Comercial",
      },
      {
        nombre: "Centro Comercial Miraflores",
        ubicacion: "Centro",
        ciudad: ciudadesGuatemala[1]._id,
        tipoSitio: "Centro Comercial",
      },
      {
        nombre: "Parque Central Villa Nueva",
        ubicacion: "Centro",
        ciudad: ciudadesGuatemala[2]._id,
        tipoSitio: "Parque",
      },
      {
        nombre: "Parque Central Xela",
        ubicacion: "Centro",
        ciudad: ciudadesGuatemala[3]._id,
        tipoSitio: "Parque",
      },
      {
        nombre: "Puerto San José",
        ubicacion: "Costa Sur",
        ciudad: ciudadesGuatemala[4]._id,
        tipoSitio: "Atracción Turística",
      },
      {
        nombre: "Parque Central Chimaltenango",
        ubicacion: "Centro",
        ciudad: ciudadesGuatemala[5]._id,
        tipoSitio: "Parque",
      },
      {
        nombre: "Mercado Huehuetenango",
        ubicacion: "Centro",
        ciudad: ciudadesGuatemala[6]._id,
        tipoSitio: "Centro Comercial",
      },
      {
        nombre: "Orquideario Cobán",
        ubicacion: "Centro",
        ciudad: ciudadesGuatemala[7]._id,
        tipoSitio: "Atracción Turística",
      },
      {
        nombre: "Puerto Barrios Terminal",
        ubicacion: "Puerto",
        ciudad: ciudadesGuatemala[9]._id,
        tipoSitio: "Atracción Turística",
      },
    ]);    console.log(
      "🏛️ Sitios creados:",
      sitiosColombia.length + sitiosCostaRica.length + sitiosGuatemala.length
    );

    // Crear platos típicos
    const platos = await Plato.insertMany([
      // Platos de Colombia
      {
        nombre: "Ajiaco Bogotano",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosColombia[0]._id, // Museo del Oro
        precio: 5
      },
      {
        nombre: "Sancocho Paisa",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosColombia[1]._id, // Zona Rosa
        precio: 7
      },
      {
        nombre: "Bandeja Paisa",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosColombia[2]._id, // Comuna 13
        precio: 7
      },
      {
        nombre: "Arepa con Queso",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosColombia[3]._id, // Pueblito Paisa
        precio: 1.5
      },
      {
        nombre: "Sancocho de Gallina",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosColombia[4]._id, // Zoológico de Cali
        precio: 6
      },
      {
        nombre: "Empanadas Vallecaucanas",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosColombia[5]._id, // Teatro Municipal
        precio: 1
      },
      {
        nombre: "Pescado Frito",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcU5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosColombia[6]._id, // Malecón
        precio: 8
      },
      {
        nombre: "Arepa de Huevo",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcV5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosColombia[7]._id, // Ciudad Amurallada
        precio: 1.5
      },
      {
        nombre: "Cabrito Asado",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcW5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosColombia[8]._id, // Parque Arboleda
        precio: 8
      },
      {
        nombre: "Patacones",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcX5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosColombia[9]._id, // Quinta de San Pedro Alejandrino
        precio: 2
      },

      // Platos de Costa Rica
      {
        nombre: "Gallo Pinto",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcY5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosCostaRica[0]._id, // Teatro Nacional
        precio: 3
      },
      {
        nombre: "Casado Típico",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcZ5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosCostaRica[1]._id, // Mercado Central
        precio: 3
      },
      {
        nombre: "Chifrijo",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcA5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosCostaRica[2]._id, // Aeropuerto Juan Santamaría
        precio: 5
      },
      {
        nombre: "Olla de Carne",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcB5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosCostaRica[3]._id, // Basílica de los Ángeles
        precio: 6
      },
      {
        nombre: "Arroz con Pollo",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcC5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosCostaRica[4]._id, // Universidad Nacional
        precio: 4
      },
      {
        nombre: "Ceviche de Corvina",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcD5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosCostaRica[5]._id, // Puerto Caldera
        precio: 6
      },
      {
        nombre: "Rice and Beans",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcE5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosCostaRica[6]._id, // Puerto Limón
        precio: 5
      },
      {
        nombre: "Tamal Costarricense",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcF5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosCostaRica[7]._id, // Parque Nacional Guanacaste
        precio: 3
      },
      {
        nombre: "Picadillo de Papa",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcG5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosCostaRica[8]._id, // Parque Central Nicoya
        precio: 3
      },
      {
        nombre: "Tres Leches",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcH5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosCostaRica[9]._id, // Plaza Central Grecia
        precio: 2
      },

      // Platos de Guatemala
      {
        nombre: "Pepián",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcI5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosGuatemala[0]._id, // Palacio Nacional
        precio: 5
      },
      {
        nombre: "Kak'ik",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcJ5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosGuatemala[1]._id, // Zona Viva
        precio: 6
      },
      {
        nombre: "Chiles Rellenos",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcK5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosGuatemala[2]._id, // Centro Comercial Miraflores
        precio: 5
      },
      {
        nombre: "Tamales Guatemaltecos",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcL5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosGuatemala[3]._id, // Parque Central Villa Nueva
        precio: 2
      },
      {
        nombre: "Pollo en Jocón",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcM5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosGuatemala[4]._id, // Parque Central Xela
        precio: 5
      },
      {
        nombre: "Tapado",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcN5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosGuatemala[5]._id, // Puerto San José
        precio: 8
      },
      {
        nombre: "Fiambre",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcO5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosGuatemala[6]._id, // Parque Central Chimaltenango
        precio: 8
      },
      {
        nombre: "Revolcado",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcP5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosGuatemala[7]._id, // Mercado Huehuetenango
        precio: 5
      },
      {
        nombre: "Pulique",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosGuatemala[8]._id, // Orquideario Cobán
        precio: 5
      },
      {
        nombre: "Caldo de Mariscos",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5wGqK9YYzYzq9K9YK9YK9YK9YK9YK9YK9w&s",
        sitio: sitiosGuatemala[9]._id, // Puerto Barrios Terminal
        precio: 8
      }
    ]);

    console.log("🍽️ Platos creados:", platos.length);

    // Crear famosos
    const famosos = await Famoso.insertMany([
      // Famosos de Colombia
      {
        nombre: "Shakira",
        ciudadNacimiento: ciudadesColombia[3]._id,
        actividad: "Cantante",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBOHI9qv3FhLlb2xo4e-cClqwQwcB3-sE45w&s",
        descripcion:
          "Cantante internacional que fusiona pop, rock y ritmos latinos.",
      },
      {
        nombre: "J Balvin",
        ciudadNacimiento: ciudadesColombia[1]._id,
        actividad: "Cantante",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ90-7uBJZzdUIIJNWbHGyFxRVpjNS7S3oNbQ&s",
        descripcion:
          "Artista urbano reconocido mundialmente por su música reggaetón.",
      },
      {
        nombre: "Santiago Alarcón",
        ciudadNacimiento: ciudadesColombia[8]._id,
        actividad: "Actor",
        foto: "https://d2yoo3qu6vrk5d.cloudfront.net/images/20190124212354/santiago-alarcon-como-el-man-es-german-800x485.jpg",
        descripcion:
          "Actor colombiano conocido por su papel en 'El man es Germán'.",
      },
      {
        nombre: "Juanes",
        ciudadNacimiento: ciudadesColombia[1]._id,
        actividad: "Cantante",
        foto: "https://i.scdn.co/image/ab676161000051741aefa2dd52fde10eba9b4d5d",
        descripcion: "Cantautor ganador de Grammys con mensajes de paz y amor.",
      },
      {
        nombre: "Radamel Falcao",
        ciudadNacimiento: ciudadesColombia[9]._id,
        actividad: "Deportista",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCkQdqWOqiYONjRQIefn6Kn69ALU_bJGOO3w&s",
        descripcion: "Delantero colombiano con carrera destacada en Europa.",
      },
      {
        nombre: "James Rodríguez",
        ciudadNacimiento: ciudadesColombia[6]._id,
        actividad: "Deportista",
        foto: "https://img.a.transfermarkt.technology/portrait/big/88103-1720681352.jpg?lm=1",
        descripcion:
          "Futbolista estrella del Mundial 2014 y figura internacional.",
      },
      {
        nombre: "Carlos Vives",
        ciudadNacimiento: ciudadesColombia[9]._id,
        actividad: "Cantante",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxDFj3FzuFxq5y5LaqWzde_Q4BOVz2XsvdyA&s",
        descripcion: "Cantante que modernizó el vallenato y lo llevó al mundo.",
      },
      {
        nombre: "Sofía Vergara",
        ciudadNacimiento: ciudadesColombia[3]._id,
        actividad: "Actriz",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxp3SSPaH3nNODUrcY5CNT_XU-9HKEwBLh7A&s",
        descripcion:
          "Actriz y comediante en Hollywood, famosa por 'Modern Family'.",
      },
      {
        nombre: "Álvaro Uribe",
        ciudadNacimiento: ciudadesColombia[1]._id,
        actividad: "Político",
        foto: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Presidente_%C3%81lvaro_Uribe_V%C3%A9lez.jpg",
        descripcion: "Expresidente de Colombia con fuerte influencia política.",
      },
      {
        nombre: "Andrea Serna",
        ciudadNacimiento: ciudadesColombia[2]._id,
        actividad: "Artista",
        foto: "https://www.caracoltvcorporativo.com/sites/default/files/styles/personajes_destacado_1008x668_/public/fotografo-hernanpuentes_1_1.jpg?itok=0Na8Z6Cb",
        descripcion:
          "Presentadora y modelo con amplia trayectoria en TV colombiana.",
      },

      // Famosos de Costa Rica
      {
        nombre: "Keylor Navas",
        ciudadNacimiento: ciudadesCostaRica[0]._id,
        actividad: "Deportista",
        foto: "https://d24ar.com/wp-content/uploads/2025/05/keylor-navas-54.jpeg",
        descripcion:
          "Portero internacional que ha brillado en Europa y mundiales.",
      },
      {
        nombre: "Debi Nova",
        ciudadNacimiento: ciudadesCostaRica[0]._id,
        actividad: "Cantante",
        foto: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Debi_nova_00.jpg",
        descripcion: "Cantautora de pop latino nominada al Grammy Latino.",
      },
      {
        nombre: "Franklin Chang-Díaz",
        ciudadNacimiento: ciudadesCostaRica[2]._id,
        actividad: "Científico",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsqETXcPFj98IkfxBYSO5xnlB0ursiTwPlSg&s",
        descripcion:
          "Físico y astronauta costarricense con 7 misiones espaciales.",
      },
      {
        nombre: "Maribel Guardia",
        ciudadNacimiento: ciudadesCostaRica[0]._id,
        actividad: "Actriz",
        foto: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Maribel_Guardia_during_an_interview_in_January_2017.png",
        descripcion: "Actriz y cantante reconocida en México y Costa Rica.",
      },
      {
        nombre: "Óscar Arias",
        ciudadNacimiento: ciudadesCostaRica[3]._id,
        actividad: "Político",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeTk6vFWoBVaO-hKPfVbP1IJr8QMggdXFKaA&s",
        descripcion:
          "Expresidente y Nobel de la Paz por su labor centroamericana.",
      },
      {
        nombre: "Claudia Poll",
        ciudadNacimiento: ciudadesCostaRica[0]._id,
        actividad: "Deportista",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIPQiM9MOK619joB5DLWlr3Sx22W3532kljA&s",
        descripcion: "Nadadora olímpica costarricense, ganadora de oro.",
      },
      {
        nombre: "Giannina Facio",
        ciudadNacimiento: ciudadesCostaRica[9]._id,
        actividad: "Actriz",
        foto: "https://upload.wikimedia.org/wikipedia/commons/8/86/Gianina_Facio_at_%27The_Martian%27_World_Premiere_%28NHQ201509110014%29_%28cropped%29.jpg",
        descripcion: "Actriz internacional y esposa del director Ridley Scott.",
      },
      {
        nombre: "Luis Guillermo Solís",
        ciudadNacimiento: ciudadesCostaRica[0]._id,
        actividad: "Político",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjLqRPEXSttA3ojBnv1X1aCRq7Z0QPf_K5FA&s",
        descripcion:
          "Expresidente que impulsó la transparencia y los derechos humanos.",
      },
      {
        nombre: "Henning Jensen",
        ciudadNacimiento: ciudadesCostaRica[1]._id,
        actividad: "Escritor",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBi9EhVbfAg9tPtLOjWoZFfumuuGEtBo8k1A&s",
        descripcion:
          "Filósofo, escritor y académico costarricense de renombre.",
      },
      {
        nombre: "Mauricio Hoffman",
        ciudadNacimiento: ciudadesCostaRica[5]._id,
        actividad: "Actor",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTogs-Wm7pqcMF_FSc_jaMIYAp39TsKzSOyxA&s",
        descripcion:
          "Actor y conductor de televisión con fuerte presencia nacional.",
      },

      // Famosos de Guatemala
      {
        nombre: "Ricardo Arjona",
        ciudadNacimiento: ciudadesGuatemala[0]._id,
        actividad: "Cantante",
        foto: "https://i.scdn.co/image/ab6761610000e5ebc39af2ce1337734a4cadadaf",
        descripcion:
          "Cantautor con letras profundas y estilo pop latino característico.",
      },
      {
        nombre: "Rigoberta Menchú",
        ciudadNacimiento: ciudadesGuatemala[3]._id,
        actividad: "Político",
        foto: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Rigoberta_Menchu.jpg",
        descripcion:
          "Activista indígena y Nobel de la Paz por su lucha por los derechos humanos.",
      },
      {
        nombre: "Luis von Ahn",
        ciudadNacimiento: ciudadesGuatemala[0]._id,
        actividad: "Científico",
        foto: "https://www.elcorreo.com/xlsemanal/wp-content/uploads/sites/5/2024/04/luis-von-ahn-creador-duolingo.jpg",
        descripcion: "Inventor de CAPTCHA y fundador de Duolingo.",
      },
      {
        nombre: "Gaby Moreno",
        ciudadNacimiento: ciudadesGuatemala[0]._id,
        actividad: "Cantante",
        foto: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Gaby_Moreno_en_Acceso_Total_3_Cropped.jpg",
        descripcion:
          "Cantautora de folk y blues, ganadora de un Grammy Latino.",
      },
      {
        nombre: "Carlos Ruiz",
        ciudadNacimiento: ciudadesGuatemala[8]._id,
        actividad: "Deportista",
        foto: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Carlos_Ruiz.JPG",
        descripcion: "Futbolista conocido como 'El Pescadito', ícono nacional.",
      },
      {
        nombre: "Paola Chuc",
        ciudadNacimiento: ciudadesGuatemala[4]._id,
        actividad: "Cantante",
        foto: "https://aprende.guatemala.com/wp-content/uploads/2020/07/biografia-paola-chuc-cantante-guatemalteca-nacimiento.jpg",
        descripcion: "Ganadora de La Academia 2018, nueva voz guatemalteca.",
      },
      {
        nombre: "Stephanie Zelaya",
        ciudadNacimiento: ciudadesGuatemala[6]._id,
        actividad: "Cantante",
        foto: "https://newmedia.ufm.edu/wp-content/uploads/2019/08/DG_20230720_acton1-FotoBio.png",
        descripcion: "Joven artista guatemalteca con proyección internacional.",
      },

      // Famosos adicionales para completar 30
      {
        nombre: "Maluma",
        ciudadNacimiento: ciudadesColombia[1]._id,
        actividad: "Cantante",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBgYtN7mQ8F5tBX9OhBfGsOPvBW-YkEfQ7Tw&s",
        descripcion: "Cantante de reggaetón y pop urbano internacional.",
      },
      {
        nombre: "Nairo Quintana",
        ciudadNacimiento: ciudadesColombia[5]._id,
        actividad: "Deportista",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd2dQnL0X5tH_iQlcVfxlBhKGQMzAXPY8b2A&s",
        descripcion: "Ciclista profesional destacado en grandes vueltas.",
      },
      {
        nombre: "Joel Campbell",
        ciudadNacimiento: ciudadesCostaRica[0]._id,
        actividad: "Deportista",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4k0tIzQRO8vJAh_Y2G7VWiTqMjEkgKJFi1w&s",
        descripcion: "Futbolista costarricense con experiencia internacional.",
      },
    ]);

    console.log("🌟 Famosos creados:", famosos.length); // Crear usuarios administrador
    const usuarios = await Usuario.insertMany([
      {
        nombre: "Diego",
        apellido: "Santacruz",
        correo: "dstz@gmail.com",
        usuario: "dsantacruz",
        contraseña: "123456",
        rol: "Administrador",
      },
      {
        nombre: "Sergio",
        apellido: "Herrera",
        correo: "sergio_and.herrera@uao.edu.co",
        usuario: "sherrera",
        contraseña: "123456",
        rol: "Administrador",
      },
      {
        nombre: "Ana",
        apellido: "García",
        correo: "ana.garcia@email.com",
        usuario: "agarcia",
        contraseña: "123456",
        rol: "UsuarioDefault",
      },
      {
        nombre: "Carlos",
        apellido: "López",
        correo: "carlos.lopez@email.com",
        usuario: "clopez",
        contraseña: "123456",
        rol: "UsuarioDefault",
      },
      {
        nombre: "María",
        apellido: "Rodríguez",
        correo: "maria.rodriguez@email.com",
        usuario: "mrodriguez",
        contraseña: "123456",
        rol: "UsuarioDefault",
      },
      {
        nombre: "Luis",
        apellido: "Martínez",
        correo: "luis.martinez@email.com",
        usuario: "lmartinez",
        contraseña: "123456",
        rol: "UsuarioDefault",
      },
      {
        nombre: "Carmen",
        apellido: "Jiménez",
        correo: "carmen.jimenez@email.com",
        usuario: "cjimenez",
        contraseña: "123456",
        rol: "UsuarioDefault",
      },
    ]);
    console.log("👤 Usuarios creados:", usuarios.length);
    console.log("✅ Base de datos poblada exitosamente");    console.log("📋 Resumen:");
    console.log(`   - Países: ${paises.length}`);
    console.log(
      `   - Ciudades: ${
        ciudadesColombia.length +
        ciudadesCostaRica.length +
        ciudadesGuatemala.length
      }`
    );
    console.log(
      `   - Sitios: ${
        sitiosColombia.length + sitiosCostaRica.length + sitiosGuatemala.length
      }`
    );
    console.log(`   - Platos: ${platos.length}`);
    console.log(`   - Famosos: ${famosos.length}`);
    console.log(
      `   - Usuarios: ${usuarios.length} (2 Administradores, 5 UsuarioDefault)`
    );
  } catch (error) {
    console.error("❌ Error poblando la base de datos:", error);
  } finally {
    mongoose.connection.close();
  }
};

poblarBaseDatos();
