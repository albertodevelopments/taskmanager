'use strict'

// Creamos y configuramos el servidor
const express = require('express')
const app = express()

// Nos conectamos a la base de datos
const dbConnection = require('./config/db')
dbConnection()

/**** MIDDLEWARES ****/
// Habilitamos CORS
const cors = require('cors')
app.use(cors())

// Habilitamos express json
app.use(express.json({ extended: true })) // Forzamos a enviar la petición de tipo application/json en el header

// Habilitamos el puerto de la aplicación
const port = process.env.PORT || 4000

// Importamos las rutas
app.use('/api/users', require('./routes/users')) // Registro
app.use('/api/auth', require('./routes/auth')) // Inicio de sesión

// Arrancamos el servidor
app.listen(port, () => {
  console.log(`Servidor arrancado en el puerto ${port}`)
})
