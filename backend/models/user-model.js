const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        phone: { type: String, required: true },
        name: { type: String, required: false },
        fakename: { type: String, required: false },
        avatar: {
            type: String,
            required: false,
            get: (avatar) => {
                if (avatar) {
                    return `http://localhost:4000${avatar}`;
                }
                return avatar;
            },
        },
        
        activated: { type: Boolean, required: false, default: false },
    },
    {
        timestamps: true,
        toJSON: { getters: true },
    }
);

module.exports = mongoose.model('User', userSchema, 'users');
