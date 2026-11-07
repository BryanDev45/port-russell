// Script à lancer à la main avec : npm run seed
// Il vide les collections puis les remplit avec les fichiers de data/
require('dotenv').config();
const mongoose = require('mongoose');
const Catway = require('./models/catway');
const Reservation = require('./models/reservation');
const catways = require('./data/catways.json');
const reservations = require('./data/reservations.json');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  await Catway.deleteMany();
  await Catway.insertMany(catways);
  console.log(`${catways.length} catways importés`);

  await Reservation.deleteMany();
  await Reservation.insertMany(reservations);
  console.log(`${reservations.length} réservations importées`);

  // Compte administrateur pour se connecter plus tard (créé une seule fois)
  const User = require('./models/user');
  if (!(await User.findOne({ email: 'admin@port-russell.fr' }))) {
    await User.create({ username: 'admin', email: 'admin@port-russell.fr', password: 'admin123' });
    console.log('Compte admin créé : admin@port-russell.fr / admin123');
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
