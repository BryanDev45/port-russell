require('dotenv').config();
const express = require('express');
const session = require('express-session');
const connectDB = require('./config/db');
const { isAuthenticated } = require('./middlewares/auth');

const app = express();

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-de-developpement',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 }
}));

app.get('/', (req, res) => {
  res.send('API du port de plaisance Russell');
});

app.use('/', require('./routes/auth'));
app.use('/catways', isAuthenticated, require('./routes/catways'));
app.use('/catways', isAuthenticated, require('./routes/reservations'));
app.use('/users', isAuthenticated, require('./routes/users'));

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
});
