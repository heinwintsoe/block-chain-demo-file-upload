var mongoose = require('mongoose');

var UploadDocSchema = new mongoose.Schema({
  owner: String,
  filename: String,
  trxHash: String,
  citizen: String,
  uploaded_date: { type: Date, default: Date.now },
}, { collection: 'app-uploads' });

module.exports = mongoose.model('UploadDoc', UploadDocSchema);