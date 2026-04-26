# 💧🏔️ ParamoSense - Sistema de Monitoreo Hídrico

ParamoSense es una plataforma web desarrollada con Angular y Node.js que permite monitorear en tiempo real el estado de fuentes hídricas y páramos mediante simulación de sensores IoT.

La aplicación integra:
- Mapas interactivos  
- Dashboards dinámicos  
- Sistema de alertas tempranas  

Todo enfocado en la preservación ambiental.

# --------------------------------------------------

## 🚀 Tecnologías Utilizadas

Frontend:
- Angular (Componentes Standalone)
- HTML5, CSS3, TypeScript

Mapas:
- Google Maps API (@angular/google-maps)

Backend:
- Node.js
- Express.js

Base de Datos:
- MongoDB (local)
- Mongoose

Seguridad:
- bcryptjs (encriptación de contraseñas)
- CORS

# --------------------------------------------------

## 📋 1. Requisitos Previos

1. Node.js
   Descargar desde: https://nodejs.org/
   Recomendado: versión LTS

2. Angular CLI
   npm install -g @angular/cli

3. MongoDB Community Server
   Descargar desde: https://www.mongodb.com/try/download/community
   Puerto por defecto: 27017

4. MongoDB Compass (Opcional)

# --------------------------------------------------

## ⚙️ 2. Instalación y Configuración

### Paso 2.1: Ubicarse en el proyecto

Abrir terminal y moverse a la carpeta raíz del proyecto:
(cd ruta/del/proyecto)

### Paso 2.2: Instalar dependencias del Frontend

npm install

### Paso 2.3: Instalar dependencias del Backend

npm install express mongoose cors bcryptjs

# --------------------------------------------------

## 🗄️ 3. Configuración de la Base de Datos

Asegurarse de que MongoDB esté corriendo en:
mongodb://127.0.0.1:27017

El sistema crea automáticamente:

Base de datos:
paramosense

Colecciones:
- users
- dashboards

### Normalización de zonas

"Cruz Verde" -> cruz_verde
"Sumapaz" -> sumapaz

Archivo relacionado:
src/assets/data/locations.json

# --------------------------------------------------

## 🏃‍♂️ 4. Ejecución de la Aplicación

### Paso 4.1: Iniciar Backend

node server.js

Salida esperada:
✅ Conectado a MongoDB local
🚀 Servidor backend corriendo en http://localhost:3000

### Paso 4.2: Iniciar Frontend (en otra terminal)

ng serve

### Paso 4.3: Abrir en navegador

http://localhost:4200

Luego registrarse e iniciar sesión.

# --------------------------------------------------

## 🗺️ 5. Flujo y Secciones

Dashboard Principal:
- Estadísticas en tiempo real
- Nivel hídrico
- Alertas
- Historial

Mapa Interactivo:
- Google Maps
- Estados:
  Verde = Normal
  Amarillo = Advertencia
  Rojo = Crítico

Archivo:
src/assets/data/locations.json

Estado del Sistema:
- Estable
- Advertencia
- Crítico

Reportes:
- Exportación de datos (si está implementado)

# --------------------------------------------------

## ⚠️ Notas Finales

- No se requiere insertar datos manualmente
- La base de datos se genera automáticamente
- MongoDB debe estar activo durante la ejecución

# --------------------------------------------------
