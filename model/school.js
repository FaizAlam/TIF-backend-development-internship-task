const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    created: {
        type: Date,
        default: () => Date.now(),
    },
    updated: {
        type: Date,
        default: null,
    },
    students: [{
        type: mongoose.Types.ObjectId,
        ref: 'student',
    }]
});

module.exports = mongoose.model('school', schoolSchema);