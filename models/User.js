
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Middleware to hash password before saving it to the database
userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    // Hash the password
    bcrypt.hash(this.password, 10, (err, hashedPassword) => {
      if (err) return next(err);
      this.password = hashedPassword;
      next();
    });
  } else {
    next();
  }
});

// Method to compare password during login
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

// Create the model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
