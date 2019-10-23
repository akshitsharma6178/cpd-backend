const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://cpd:cpd@localhost:27017/cpd?authSource=cpd';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports.client = client;

// Use connect method to connect to the Server
// client.connect((err, client) => {
//     console.log("Connected to database");
//
//     const db = client.db("cpd");
//     console.log("Switched to database cpd");
//
//     // db.collection('users').insertOne({
//     //     email: "pawan.s1998@gmail.com",
//     //     password: ""
//     // }).then(function(result) {
//     //        console.log(result);
//     //     });
//
//     client.close().then(() => {
//         console.log("Closed Connection to database",);
//     }, () => {
//         console.log("Error closing connection to database");
//     });
// });


