// src/server.js
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require("dotenv");
const authRoutes = require('./backend/routes/authRoutes');
const bugRoutes = require('./backend/routes/bugRoutes');
const userRoutes = require('./backend/routes/userRoutes');
const { log } = require('./backend/utils/logger');
const cors = require('cors');

const app = express();
const port = 3001;

dotenv.config();

app.use(express.json());
const corsPolicy = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200

}
app.use(cors(corsPolicy))
// app.use(cors());
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/bugs', bugRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Express backend is running!');
});

app.use((err, req, res, next) => {
  log(`Error: ${err.message}`);
  res.status(500).json({ success: false, message: 'Internal Server Error', errors: [err.message] });
});

app.listen(port, () => {
  log(`Backend server running on http://localhost:${port}`);
});