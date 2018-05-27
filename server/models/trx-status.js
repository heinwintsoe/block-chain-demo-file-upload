var TrxStatus = {
    PENDING: 'Pending', // - pending to deliever to Ethereum network
    ETHEREUM: 'Ethereum', // - Sent to Ethereum but have not deliever to Farbric
    DELIEVERED: 'Delievered' // - Delievered to other Farbric network
}

module.exports = TrxStatus;