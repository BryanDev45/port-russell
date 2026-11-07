// Script à lancer à la main avec : npm run seed
// Il vide la collection des catways puis la remplit avec data/catways.json
require('dotenv').config();
const mongoose = require('mongoose');
const Catway = require('./models/catway');
const catways = require('./data/catways.json');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Catway.deleteMany();
  await Catway.insertMany(catways);
  console.log(`${catways.length} catways importés`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
