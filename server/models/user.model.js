var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  address: String,
}, { collection: 'app-users' });

module.exports = mongoose.model('User', UserSchema);