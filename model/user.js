const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    mobile: {
        type: String,

    },
    roleId: {
        type: mongoose.Types.ObjectId,
        ref: 'role',
    },
    created: {
        type: Date,
        default: () => Date.now(),
    },
    updated: {
        type: Date,
        default: null,
    }

});

module.exports = mongoose.model('user', userSchema);