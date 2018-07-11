pragma solidity ^0.4.0;

contract GceCertificate {
    
    string gceLevel;
    string nirc;
    string certificateHash;
    
    struct Subject {
        string name;
        string grade;
    }
    
    mapping(string => Subject) subjects;
    
    function GceOLevelCertificate(
        string nircNo, string certiHash, string engGrade,
        string mathGrade, string motherTonGrade, string scienceGrade) public {
        setGceLevel("O");
        setNirc(nircNo);
        setCertificateHash(certiHash);
        setSubject("English", engGrade);
        setSubject("Mathematics", mathGrade);
        setSubject("MotherTongue", motherTonGrade);
        setSubject("Science", scienceGrade);
    }
    
    function GceALevelCertificate(
        string nircNo, string certiHash, string engGrade,
        string mathGrade, string motherTonGrade, string chemGrade, string bioGrade,
        string geogGrade, string histGrade) public {
        setGceLevel("A");
        setNirc(nircNo);
        setCertificateHash(certiHash);
        setSubject("English", engGrade);
        setSubject("Mathematics", mathGrade);
        setSubject("MotherTongue", motherTonGrade);
        setSubject("Chemistry", chemGrade);
        setSubject("Bio", bioGrade);
        setSubject("Geography", geogGrade);
        setSubject("History", histGrade);
    }
    
    function setGceLevel(string x) public {
        gceLevel = x;
    }

    function getGceLevel() public view returns (string) {
        return gceLevel;
    }
    
    function setNirc(string x) public {
        nirc = x;
    }
    
    function getNirc() public view returns (string) {
        return nirc;
    }
    
    function setCertificateHash(string x) public {
        certificateHash = x;
    }
    
    function getCertificateHash() public view returns (string) {
        return certificateHash;
    }
    
    function setSubject(string name, string grade) public {
        Subject storage subject = subjects[name];
        subject.name = name;
        subject.grade = grade;
    }
    
    function getGrade(string sbj) public view returns (string) {
        return subjects[sbj].grade;
    }
    
}