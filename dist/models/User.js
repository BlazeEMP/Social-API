import { Schema, model } from 'mongoose';
const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trimmed: true,
        max_length: 36,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        // TODO: Add email validation Mongooses matching validation
    },
    thoughts: {
        type: [Schema.Types.ObjectId],
        ref: 'Thought',
    },
    friends: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
    },
}, {
    toJSON: {
        virtuals: true,
        getters: true,
    },
    id: true, // TODO Verify this is correct when not using id field in constructor
});
userSchema.virtual('friendCount').get(function () {
    return this.friends?.length;
});
const User = model('User', userSchema);
export default User;
