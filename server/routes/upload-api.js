var express = require('express');
var router = express.Router();
var fs = require('fs');
var IPFS = require('ipfs-api');
var Web3 = require('web3');
var MyContract = require('../smart-contracts/my-contract');
var AppConfig = require('../config/app-config');
var UploadTrx = require('../models/upload-trx');
var TrxStatus = require('../models/trx-status');

router.post('/upload-file', function (req, res, next) {
    var fstream;
    if (req.busboy) {
        req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            const ipfs = new IPFS(AppConfig.ipfsConfig);
            ipfs.add(file, async (err, ipfsHash) => {
                var hash_code = ipfsHash[0].hash;
                console.log('Ipfs Hash: ' + hash_code);

                const web3 = new Web3(new Web3.providers.HttpProvider(AppConfig.ethereum.networkUrl));
                const accounts = await web3.eth.getAccounts();
                const sender = accounts[0];
                console.log('Sender: ' + sender);
                
                var uploadTrx = new UploadTrx();
                uploadTrx.ipfsHash = hash_code;
                uploadTrx.sender = sender;
                uploadTrx.filename = filename;
                uploadTrx.upload_status = TrxStatus.PENDING;
                console.log(uploadTrx);

                UploadTrx.create(uploadTrx, async function (err, trxEntity) {
                    if (err) return next(err);
                    
                    const storehash = new web3.eth.Contract(MyContract.abi, MyContract.address);
                    const ethAddress = await storehash.options.address;
                    storehash.methods.sendHash(trxEntity.ipfsHash).send({
                        from: sender
                    }, async (error, transactionHash) => {
                        trxEntity.trxHash = transactionHash;
                        trxEntity.upload_status = TrxStatus.ETHEREUM;
                        await UploadTrx.findByIdAndUpdate(trxEntity._id, trxEntity, function (err, post) {
                            if (err) return next(err);
                            console.log('Update done');
                        });

                        await UploadTrx.findById(trxEntity._id, function (err, post) {
                            if (err) return next(err);
                            console.log('---------- find by id ---------');
                            console.log(post);
                            res.json({success: true, data: post});
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

router.get('/find-all', function(req, res, next) {
    UploadTrx.find({}, function(err, docs) {
        if (err) return next(err);
        console.log(docs);
        res.json({success: true, data: docs});
    });
});

module.exports = router;
