import { Schema, Types, model, type Document } from 'mongoose';

interface IUser extends Document {
    // TODO verify _id needed or how we recieve by default
    _id: Schema.Types.ObjectId,
    username: string,
    email: string,
    thoughts: Schema.Types.ObjectId[],
    friends: Schema.Types.ObjectId[]
}

const userSchema = new Schema<IUser>({
    // TODO verify _id needed or how we recieve by default
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
},
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
        timestamps: true
    }
);

// TODO verify virtual
userSchema.virtual('friendCount').get(function () {
    return this.friends?.length;
});

const User = model('User', userSchema);

export default User;