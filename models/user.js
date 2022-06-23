const { Schema, model, SchemaTypes } = require('mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
    },
    thoughts: [{
        type: Schema.Types.ObjectId,
        ref: 'Thought'
    }],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

}, {
    toJSON: {
        virtuals: true,
    },
    id: false
});

UserSchema.virtual('friendCount').get(function() {
    const friendCount = this.friends.length;
    return friendCount
});

const User = model('User', UserSchema);

module.exports = User;