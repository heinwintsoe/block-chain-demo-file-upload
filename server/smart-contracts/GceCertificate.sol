pragma solidity ^0.4.17;

contract GceCertificate {
    
    string certificateData;
    
    function saveCertificate(string json) public {
        certificateData = json;
    }

    function getCertificate() public view returns (string x) {
        return certificateData;
    }
    
}