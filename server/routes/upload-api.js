var express = require('express');
var router = express.Router();
var fs = require('fs');
var IPFS = require('ipfs-api');
var Web3 = require('web3');
var InputDataDecoder = require('ethereum-input-data-decoder');
var MyContract = require('../smart-contracts/my-contract');
var AppConfig = require('../config/app-config');
var UploadDoc = require('../models/upload.model');
var User = require('../models/user.model');

var GceCertificate = require('../smart-contracts/gce-certificate');
router.post('/upload-certificate', function(req, res, next) {
    console.log('/upload-certificate');
    if (req.busboy) {
        var submittedData = {};
        req.busboy.on('field', function (fieldname, fieldvalue) {
            submittedData[fieldname] = fieldvalue;
        });
        req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            const ipfs = new IPFS(AppConfig.ipfsConfig);
            console.log('Uploadeding to IPFS - ' + filename);
            ipfs.add(file, async (err, ipfsHash) => {
                const certificateData = JSON.parse(submittedData.certificateData);
                certificateData.filename = filename;
                certificateData.file = ipfsHash[0].hash;
                const senderInfo = JSON.parse(submittedData.senderInfo);

                console.log('Sending to ethereum - GCE ' + JSON.stringify(certificateData));
                const web3 = new Web3(new Web3.providers.HttpProvider(AppConfig.ethereum.networkUrl));
                const gceCertificateContract = new web3.eth.Contract(GceCertificate.abi, GceCertificate.address);
                const sender = senderInfo.address;
                gceCertificateContract.methods.saveCertificate(JSON.stringify(certificateData))
                    .send({ from: sender, gas: 3000000 }).on('transactionHash', async (txnHash) => {
                        console.log('Persisting into database - ' + txnHash);
                        var uploadedFile = new UploadDoc();
                        uploadedFile.owner = senderInfo.address;
                        uploadedFile.citizen = certificateData.nirc;
                        uploadedFile.filename = filename;
                        uploadedFile.trxHash = txnHash;
                        await UploadDoc.create(uploadedFile, (err, doc) => {
                            if (err) return next(err);
                            res.json({ success: true, data: doc });
                        });
                    });

            });
        });
        req.busboy.on('finish', function () {
            console.log('Certificate is received.');
        });
        req.pipe(req.busboy);
    }
});

router.get('/certificate-details/:address', async (req, res, next) => {
    console.log('/certificate-details/:address');
    const web3 = new Web3(new Web3.providers.HttpProvider(AppConfig.ethereum.networkUrl));
    web3.eth.getTransaction(req.params.address, async (err, trxData) => {
        console.log('Decoding trx data');
        const decoder = new InputDataDecoder(GceCertificate.abi);
        const decodedInput = decoder.decodeData(trxData.input);
        const certificateData = JSON.parse(decodedInput.inputs[0]);
        console.log(certificateData);
        var result = {
            fileDetails: {
                trxHash: trxData.hash,
                blockHash: trxData.blockHash,
                from: trxData.from,
                certificate: certificateData,
                fileUrl: AppConfig.ipfsConfig.ipfsGateway + certificateData.file
            },
            trxData: trxData
        };
        res.json({success: true, data: result});
    });

});

router.get('/find-all/:username', function(req, res, next) {
    User.find({ username: req.params.username }, (err, userDoc) => {
        if (err) return next(err);
        UploadDoc.find({owner: userDoc[0].address}, (err, docs) => {
            if (err) return next(err);
            res.json({success: true, data: docs});
        }).sort({ _id: -1 });
    });
});

module.exports = router;
