var GceCertificate = {
    address: '0xc4562C0dFec60cB0240Be4A5E25259aD8e67e014',
    abi: [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "json",
                    "type": "string"
                }
            ],
            "name": "saveCertificate",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getCertificate",
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
}

module.exports = GceCertificate;