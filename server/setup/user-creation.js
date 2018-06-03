/* Use Robo 3T to run */
// Creating collection
db.createCollection('app-users');
// Inserting new users
db.getCollection('app-users').insertMany([
    {username: 'userone', password: 'pass1234', address: '0x4998475AB77d7f0Db7a4E9b369CE8E6CAbDBB886'},    
    {username: 'usertwo', password: 'pass1234', address: '0xB329C3336DF136De52221886DA10Bc2e298D69D4'},
    {username: 'userthree', password: 'pass1234', address: '0xa23B4b9AC97036C7951dd22d98f04F6868400853'}
]);