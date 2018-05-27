var AppConfig = {

    ipfsConfig: { 
        host: 'ipfs.infura.io', 
        port: 5001, 
        protocol: 'https' 
    },

    dbConfig: {
        dbUrl: 'mongodb://localhost/demo-file-upload'
    },

    ethereum: {
        networkUrl: 'http://localhost:7545'
    }

}

module.exports = AppConfig;