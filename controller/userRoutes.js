const express = require('express');
const router = express.Router();
const user = require('../model/user');
const student = require('../model/student');
const roles = require('../model/roles');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('./passportLocal')(passport);
const scopes = require('./verifyToken');


const TOKEN_SECRET = "sdfjkshdfweirowe"


function preprop(req, res, next) {
    u_id = req.user;
    user.find({ _id: u_id }, function(err, data) {
        if (err) throw err;
        if (data.length < 1) {
            return;
        } else {
            usrRole = data[0].roleId;
            //res.json(usrRole);
            //console.log(usrRole)
            roles.find({ _id: usrRole }, function(err, role) {
                if (err) throw err;
                else {
                    usrScopes = role[0].scopes;
                    res.send(usrScopes);

                }
            })
        }
    })
}


router.post('/signup', (req, res) => {
    const data = req.body;
    //console.log(req.body);
    fname = data.first_name;
    lname = data.last_name;
    email = data.email;
    mobile = data.mobile;
    password = data.password;
    roleId = data.roleId;

    if (!email || !password || !fname || !lname || !mobile || !roleId) {
        //res.send("error! fill all the fields")
        console.log(fname, lname, email, mobile, password, roleId)
        res.send("err")
    } else {

        // validate email and username and password 
        // skipping validation
        // check if a user exists
        user.findOne({ email: email }, function(err, data) {
            if (err) throw err;
            if (data) {
                res.send("User Exists, Try Logging In !");
            } else {
                // generate a salt
                bcryptjs.genSalt(12, (err, salt) => {
                    if (err) throw err;
                    // hash the password
                    bcryptjs.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        // save user in db
                        user({
                            first_name: fname,
                            last_name: lname,
                            email: email,
                            mobile: mobile,
                            password: hash,
                            roleId: roleId,

                        }).save((err, data) => {
                            if (err) throw err;
                            // login the user
                            // use req.login
                            // redirect , if you don't want to login
                            //console.log(first_name, last_name, email, password, roleId)
                            res.status(200).send("Wuhuuuu registered!!!");
                        });
                    })
                });
            }
        });
    }
});

router.post('/signin', (req, res, next) => {
    const data = req.body;
    //console.log(req.body);
    email = data.email;
    password = data.password;
    if (!email || !password) {
        //res.send("error! fill all the fields")
        console.log("error");
        res.send("err")
    } else {
        user.findOne({ email: email }, function(err, data) {
            if (err) throw err;
            if (!data) {
                res.status(404).send("No user found");
            } else {
                console.log(data)
                validPass = bcryptjs.compareSync(password, data.password);
                if (!validPass) return res.status(400).send("Invalid Password");
                else {
                    //create and assign a token
                    const token = jwt.sign({ _id: data.id }, TOKEN_SECRET, { expiresIn: "1h" });
                    res.cookie("token", token, {
                        httpOnly: true,
                    })
                    console.log(token);
                    res.header('auth-token', token).send(data);
                }
            }
        })
    }
});

router.get('/', scopes, (req, res, next) => {
    u_id = req.user;
    user.find({ _id: u_id }, function(err, data) {
        if (err) throw err;
        if (data.length < 1) {
            return;
        } else {
            usrRole = data[0].roleId;
            //res.json(usrRole);
            //console.log(usrRole)
            roles.find({ _id: usrRole }, function(err, role) {
                if (err) throw err;
                else {
                    usrScopes = role[0].scopes;
                    if (usrScopes.includes('user-get')) {
                        user.find({})
                            .then(usrs => {
                                res.json(usrs);
                            });
                    } else {
                        res.status(404).send("Out of Scope!");
                    }

                }
            })
        }
    })
});

router.get('/:id', scopes, (req, res, next) => {
    u_id = req.user;
    user.find({ _id: u_id }, function(err, data) {
        if (err) throw err;
        if (data.length < 1) {
            return;
        } else {
            usrRole = data[0].roleId;
            //res.json(usrRole);
            //console.log(usrRole)
            roles.find({ _id: usrRole }, function(err, role) {
                if (err) throw err;
                else {
                    usrScopes = role[0].scopes;
                    if (usrScopes.includes('user-get')) {
                        user.find({ _id: req.params.id })
                            .then(usrs => {
                                res.json(usrs);
                            });
                    } else {
                        res.status(404).send("Out of Scope!");
                    }

                }
            })
        }
    })
});




module.exports = router;