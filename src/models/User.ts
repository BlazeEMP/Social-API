import { Schema, model, Document } from 'mongoose';

// Function here from https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript/46181#46181
const validateEmail = (email: String) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

interface IUser extends Document {
    username: string,
    email: string,
    thoughts: Schema.Types.ObjectId[],
    friends: Schema.Types.ObjectId[]
}

const userSchema = new Schema<IUser>({
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
        validate: [validateEmail, 'Please enter a valid email address'],
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
        id: true,
    }
);

userSchema.virtual('friendCount').get(function () {
    return this.friends?.length;
});

const User = model('User', userSchema);

export default User;