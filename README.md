# Front End - Gestión de Películas y Series

Frontend desarrollado como **Evidencia de Aprendizaje 2** para la asignatura **Ingeniería Web II** de la **IU Digital de Antioquia**.

La aplicación fue desarrollada con **ReactJs** y permite consumir la API REST construida previamente con Node.js, Express, MongoDB y Mongoose.

## Funcionalidades

La aplicación permite administrar los siguientes módulos:

- Géneros
- Directores
- Productoras
- Tipos
- Media (Películas y Series)

En cada módulo es posible consultar, crear, actualizar y eliminar registros.

El módulo Media permite relacionar una película o serie con:

- Género
- Director
- Productora
- Tipo

## Tecnologías utilizadas

- ReactJs
- Vite
- Axios
- React Router
- Bootstrap
- SweetAlert2

## Ejecución

Instalar las dependencias:

```bash
npm install

Iniciar el proyecto:

npm run dev

La aplicación se ejecuta por defecto en:

http://localhost:5173
API REST

El frontend consume la API ejecutada en:

http://localhost:4000/api

Repositorio del backend:

https://github.com/maicolmadrid-alt/peliculas-backend