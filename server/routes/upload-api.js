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

router.post('/upload-file/:username/:citizen', function (req, res, next) {
    var fstream;
    if (req.busboy) {
        req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            const ipfs = new IPFS(AppConfig.ipfsConfig);
            ipfs.add(file, async (err, ipfsHash) => {

                User.find({ username: req.params.username }, async (err, userDoc) => {
                    if (err) return next(err);
                    
                    const sender = userDoc[0].address;

                    var uploadDoc = new UploadDoc();
                    uploadDoc.owner = sender;
                    uploadDoc.citizen = req.params.citizen;
                    uploadDoc.filename = filename;
                    
                    const ipfsHashCode = ipfsHash[0].hash;
                    const web3 = new Web3(new Web3.providers.HttpProvider(AppConfig.ethereum.networkUrl));
                    const storehash = new web3.eth.Contract(MyContract.abi, MyContract.address);
                    storehash.methods.sendHash(ipfsHashCode).send({
                        from: sender
                    }, async (error, transactionHash) => {
                        uploadDoc.trxHash = transactionHash;
                        await UploadDoc.create(uploadDoc, (err, doc) => {
                            if (err) return next(err);
                            res.json({ success: true, data: doc });
                        });
                    }); //storehash 
                });
            });

            req.busboy.on('finish', function () {
                console.log('Finish, files uploaded ');
            });
        });

        req.pipe(req.busboy);

    } // end of if (req.busboy) {
})

router.get('/find-all/:username', function(req, res, next) {
    User.find({ username: req.params.username }, (err, userDoc) => {
        if (err) return next(err);
        UploadDoc.find({owner: userDoc[0].address}, (err, docs) => {
            if (err) return next(err);
            res.json({success: true, data: docs});
        }).sort({ _id: -1 });
    });
});

router.get('/find-details/:address', async (req, res, next) => {
    const web3 = new Web3(new Web3.providers.HttpProvider(AppConfig.ethereum.networkUrl));

    await UploadDoc.find({trxHash: req.params.address}, async (err, docs) => { 
        if (err) return next(err);
        console.log(docs);

        await web3.eth.getTransaction(req.params.address, async (err, trxData) => {
            const decoder = new InputDataDecoder(MyContract.abi);
            console.log(trxData);
            const decodedInput = decoder.decodeData(trxData.input);
            const ipfsHash = decodedInput.inputs[0];
            var result = {
                fileDetails: {
                    trxHash: trxData.hash,
                    blockHash: trxData.blockHash,
                    from: trxData.from,
                    citizen: docs[0].citizen,
                    filename: docs[0].filename,
                    fileUrl: AppConfig.ipfsConfig.ipfsGateway + ipfsHash
                },
                trxData: trxData
            };
            res.json({success: true, data: result});
        }); //await for getTransactionReceipt

    });

});

module.exports = router;
