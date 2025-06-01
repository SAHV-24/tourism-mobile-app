# Ejemplo de envío de Tag con imagen usando FormData (frontend)

Para crear un nuevo tag y subir una imagen (campo `foto` o `fotoUrl`), debes enviar la información como `multipart/form-data` usando `FormData` en el frontend. Aquí tienes un ejemplo en JavaScript (React, fetch API):

```js
const formData = new FormData();
formData.append('usuario', '6657e1b2c2a1b2c3d4e5f001');
formData.append('famoso', '6657e1b2c2a1b2c3d4e5f002');
formData.append('latitud', 4.710989);
formData.append('longitud', -74.072092);
formData.append('comentario', 'Lo vi en el centro de Bogotá');
formData.append('foto', fileInput.files[0]); // fileInput es un <input type="file" />

fetch('http://localhost:8080/api/tags', {
  method: 'POST',
  body: formData,
  headers: {
    // No pongas 'Content-Type', fetch lo gestiona automáticamente para FormData
    'Authorization': 'Bearer TU_TOKEN', // si usas autenticación
  },
})
  .then(res => res.json())
  .then(data => console.log(data));
```

**Notas:**
- El campo de la imagen debe llamarse `foto` o `fotoUrl` según cómo lo procese tu backend (usualmente `foto` si usas multer o similar).
- Los campos numéricos (latitud, longitud) pueden enviarse como string o number, el backend debe convertirlos.
- Si usas React, puedes obtener el archivo con `event.target.files[0]` desde un input tipo file.
- No incluyas el header `Content-Type`, el navegador lo gestiona automáticamente.

**Ejemplo de body generado por FormData:**

```
usuario: 6657e1b2c2a1b2c3d4e5f001
famoso: 6657e1b2c2a1b2c3d4e5f002
latitud: 4.710989
longitud: -74.072092
comentario: Lo vi en el centro de Bogotá
foto: <archivo-imagen>
```

Así el backend recibirá la imagen y los datos del tag correctamente.
