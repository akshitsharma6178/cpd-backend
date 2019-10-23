const express = require('express');
const router = express.Router();
const dbClient = require('../app/db-manager');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// let RSA_PRIVATE_KEY;
const saltRounds = 10;
const RSA_PRIVATE_KEY = fs.readFileSync('./data/keys/private.key', 'utf-8');

router.post('/new', (req, res) => {
    if (req.body.email && req.body.password && req.body.firstName) {
        bcrypt.hash(req.body.password, saltRounds,(err, hash) => {
            dbClient.client.connect((err, client) => {
                console.log("Connected to database");

                const db = client.db("cpd");
                console.log("Switched to database cpd");

                db.collection('users').insertOne({
                    email: req.body.email,
                    password: hash,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                }).then((result) => {
                    res.json({
                        result: true,
                        message: "User Registered Successfully"
                    });
                });

                client.close().then(() => {
                    console.log("Closed Connection to database",);
                }, () => {
                    console.log("Error closing connection to database");
                });
            })

        });
    } else {
        res.status(400).json({
            result: false,
            message: "Required fields missing"
        })
    }
});

router.post('/login', (req, res) => {
    dbClient.client.connect((err, client) => {
        console.log("Connected to database");

        const db = client.db("cpd");
        console.log("Switched to database cpd");

        db.collection('users', (err, collection) => {
            collection.findOne({
                email: req.body.email
            }).then((user) => {
                if (!user) {
                    res.status(400).json({
                        result: false,
                        message: 'Please enter correct details'
                    })
                } else {
                    bcrypt.compare(req.body.password, user.password, (err, result) => {
                        if (result === true) {
                            const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                                algorithm: 'RS256',
                                expiresIn: 12000,
                                subject: user._id.toString()
                            });
                            res.json({
                                result: true,
                                message: 'User successfully Logged In',
                                token: jwtBearerToken
                            });
                        } else {
                            res.status(400).json({
                                result: false,
                                message: 'Incorrect Password'
                            });
                        }
                    })
                }

            });
        });
        client.close().then(() => {
            console.log("Closed Connection to database",);
        }, () => {
            console.log("Error closing connection to database");
        });
    });
});

// Export router
module.exports = router;



