const express = require('express');
const router = express.Router();
const user = require('../model/user');
const student = require('../model/student');
const roles = require('../model/roles');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const scopes = require('./verifyToken')

router.post('/', (req, res) => {
    const data = req.body;
    roleName = data.name;
    roleScope = data.scopes;
    //console.log(roleScope);

    roles.findOne({ role_name: roleName }, function(err, data) {
        if (err) throw err;
        if (data) {
            res.status(210).send('Role already exist');
        } else {
            console.log('Role doesnot exist, so we will create one!');
            roles({
                role_name: roleName,
                scopes: roleScope
            }).save((err, works) => {
                if (err) throw err;

                res.status(200).send("Role created");
            })
        }
    })


})


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
                    if (usrScopes.includes('role-get')) {
                        roles.find({}, function(err, allRole) {
                            if (err) throw err;
                            else {
                                res.json(allRole)
                            }
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