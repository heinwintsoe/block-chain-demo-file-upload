var express = require('express');
var router = express.Router();
var fs        = require('fs');
var IPFS = require('ipfs-api');
var Web3 = require('web3');

var hash_code = 'abc';

router.get('/', function (req, res) {
    res.send('GET request to the homepage')
})

router.post('/upload-file', function(req, res, next) {
    var fstream;
    if (req.busboy) {
      req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
        ipfs.add(file, async (err, ipfsHash) => {
          //setState by setting ipfsHash to ipfsHash[0].hash 
          // this.setState({ ipfsHash:ipfsHash[0].hash });
          console.log(ipfsHash[0].hash);
          hash_code = ipfsHash[0].hash;

          const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
          const accounts = await web3.eth.getAccounts();
          console.log('Sending from Metamask account: ' + accounts[0]);
          const storehash = new web3.eth.Contract(abi, address);
          const ethAddress= await storehash.options.address;
          console.log(ethAddress);
          storehash.methods.sendHash(hash_code).send({
            from: accounts[0] 
          }, async (error, transactionHash) => {
            console.log(transactionHash);

            await web3.eth.getTransactionReceipt(transactionHash, (err, txReceipt)=>{
              console.log(txReceipt);
              
              res.json({ success : true, data: {ipfsHash: hash_code, from: accounts[0] ,trxData: txReceipt}});
            }); //await for getTransactionReceip

          }); //storehash 
        });

        req.busboy.on('finish', function(){
          console.log('Finish, files uploaded ');
        });
      });

      req.pipe(req.busboy);

    } // end of if (req.busboy) {
  })

const address = '0xc4562C0dFec60cB0240Be4A5E25259aD8e67e014';

const abi = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "x",
        "type": "string"
      }
    ],
    "name": "sendHash",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getHash",
    "outputs": [
      {
        "name": "x",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]
  
module.exports = router;
