const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * @typedef {Object} User
 * @property {string} username Nom d'utilisateur
 * @property {string} email    Adresse email (unique)
 * @property {string} password Mot de passe (stocké haché, jamais en clair)
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Le nom d'utilisateur est obligatoire"],
    trim: true,
    minlength: [3, "Le nom d'utilisateur doit contenir au moins 3 caractères"]
  },
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    unique: true,
    lowercase: true, // toujours enregistré en minuscules
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
  }
}, {
  // Quand un utilisateur est converti en JSON (res.json), on retire le mot de passe
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    }
  }
});

// Avant chaque enregistrement : on hache le mot de passe s'il a changé
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

/**
 * Compare un mot de passe saisi avec le mot de passe haché de l'utilisateur.
 * @param {string} candidate Mot de passe saisi
 * @returns {Promise<boolean>} true s'il correspond
 */
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
