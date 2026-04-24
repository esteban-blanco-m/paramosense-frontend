const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Nueva librería para encriptar

const app = express();
app.use(cors());
app.use(express.json());

// 1. Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/paramosense')
  .then(() => console.log('✅ Conectado a MongoDB local'))
  .catch(err => console.error('❌ Error conectando a MongoDB', err));

// 2. Modelo de Usuario
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// --- RUTAS DE AUTENTICACIÓN ---

// A. Ruta para REGISTRAR usuario
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el correo ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardar usuario
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
});

// B. Ruta para INICIAR SESIÓN (Login)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario por correo
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    res.status(200).json({ message: 'Login exitoso', userName: user.name });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
});

// 3. Encender servidor
app.listen(3000, () => {
  console.log('🚀 Backend corriendo en http://localhost:3000');
});
