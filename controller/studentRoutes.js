const express = require('express');
const router = express.Router();
const user = require('../model/user');
const roles = require('../model/roles');
const student = require('../model/student');
const school = require('../model/school');
const bcryptjs = require('bcryptjs');
const scopes = require('./verifyToken')

router.post('/', scopes, (req, res, next) => {
    data = req.body;
    const cname = data.name;
    const userId = data.userId;
    const schoolId = data.schoolId;


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
                    if (usrScopes.includes('student-create')) {

                        school.find({ _id: schoolId }, function(err, data) {
                            if (err) throw err;
                            if (!data) {
                                res.status(404).send("School Id not found");
                            } else {
                                student.find({ userId: userId }, function(err, stdnt) {
                                    if (err) throw err;
                                    console.log()
                                    if (stdnt.length > 0) {
                                        res.status(404).send("Student already exist");
                                    } else {
                                        student({
                                            name: cname,
                                            userId: userId,
                                            schoolId: schoolId
                                        }).save((err, saved) => {
                                            if (err) throw err;

                                            data[0].students.push(saved._id);
                                            data[0].save();
                                            res.status(200).send("Student's details saved!");
                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        res.status(404).send("Out of Scope!");
                    }

                }
            })
        }
    })


});

router.get('/', (req, res, next) => {

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
                    if (usrScopes.includes('student-get')) {
                        student.find({})
                            .then(stdnts => {
                                res.json(stdnts);
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