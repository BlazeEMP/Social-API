import { Schema, Types, model } from 'mongoose';
const userSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
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
    id: false,
    timestamps: true
});
// TODO verify virtual
userSchema.virtual('friendCount').get(function () {
    return this.friends?.length;
});
const User = model('User', userSchema);
export default User;
