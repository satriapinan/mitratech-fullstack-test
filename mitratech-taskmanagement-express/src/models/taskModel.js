const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 100,
    },
    description: {
        type: String,
        maxlength: 500,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    category: {
        type: String,
        maxlength: 50,
    },
    deadline: {
        type: Date,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Task', TaskSchema);
