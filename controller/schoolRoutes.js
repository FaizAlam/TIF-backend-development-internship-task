const express = require('express');
const router = express.Router();
const user = require('../model/user');
const roles = require('../model/roles');
const student = require('../model/student');
const school = require('../model/school');
const bcryptjs = require('bcryptjs');
const userRoutes = require('./userRoutes');
const scopes = require('./verifyToken')


router.post('/', scopes, (req, res, next) => {
    const data = req.body;
    const sname = data.name;
    const city = data.city;
    const state = data.state;
    const country = data.country;

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
                    if (usrScopes.includes('school-create')) {
                        if (!sname || !city || !state || !country) {
                            res.status(404).send("Please input all the fields");
                        } else {
                            school.find({ name: sname }, function(err, succ) {
                                if (err) throw err;
                                else {
                                    school({
                                        name: sname,
                                        city: city,
                                        state: state,
                                        country: country,

                                    }).save((err, saved) => {
                                        if (err) throw err;

                                        res.status(200).send("School added in the database!");
                                    })
                                }
                            })
                        }
                    } else {
                        res.status(404).send("Out of Scope!");
                    }

                }
            })
        }
    })

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
                    if (usrScopes.includes('school-get')) {
                        school.find({}, function(err, data) {
                            if (err) throw err;
                            res.json(data);
                        })
                    } else {
                        res.status(404).send("Out of Scope!");
                    }

                }
            })
        }
    })

});

router.get('/students', scopes, (req, res, next) => {

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
                    if (usrScopes.includes('school-students')) {
                        school
                            .findOne({})
                            .populate("students") // key to populate
                            .then(scl => {
                                res.json(scl);
                            });
                    } else {
                        res.status(404).send("Out of Scope!");
                    }

                }
            })
        }
    })




})

module.exports = router;