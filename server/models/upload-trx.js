var mongoose = require('mongoose');

var UploadTrxSchema = new mongoose.Schema({
  ipfsHash: String,
  sender: String,
  filename: String,
  upload_status: String, 
  trxHash: String,
  uploaded_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UploadTrx', UploadTrxSchema);