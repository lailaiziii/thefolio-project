const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  email: { type: String, required: true, unique: true, lowercase: true, trim: true },

  password: { type: String, required: true, minlength: 6 },

  role: { type: String, enum: ['member', 'admin'], default: 'member' },

  status: { type: String, enum: ['active', 'inactive'], default: 'active' },

  bio: { type: String, default: '' },

  profilePic: { type: String, default: '' } // stores filename e.g. 'abc123.jpg'
  
}, { timestamps: true });

// Method to compare entered password with hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (this.password && !this.password.startsWith('$2')) {
    return enteredPassword === this.password;
  }

  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash the password before saving a new user or when it changes
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
