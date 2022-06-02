const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    role_name: {
        type: String,
        required: true,
    },

    scopes: { type: Array },

    created: {
        type: Date,
        default: () => Date.now(),
    },
    updated: {
        type: Date,
        default: null,
    }
});

module.exports = mongoose.model('role', roleSchema);