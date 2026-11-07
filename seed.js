// Remplit la base : npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const Catway = require('./models/catway');
const Reservation = require('./models/reservation');
const User = require('./models/user');
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
