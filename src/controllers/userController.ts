import { Request, Response } from 'express';
import { User, Thought } from '../models/index.js';

// routes for /api/users ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// GET for all users /users
export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find().select('-__v'); // exclude __v field, we don't need to check version key when reporting a user document
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: "Error in getAllUsers(): ", error: error.message });
    }
}

// POST  for new User /users
export const createUser = async (req: Request, res: Response) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error: any) {
        res.status(500).json({ message: "Error in createUser(): ", error: error.message });
    }
}

// routes for /api/users/:userId ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// GET for user by id /users/:userId
export const getUserById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const user = await User.findOne({ _id: userId })
            .select('-__v') // exclude __v field, we don't need to check version key when reporting a user document
            .select('-_id') // we send the id to get this one, we don't need to report the id again
            .populate({ path: 'thoughts', select: '-__v -_id' })
            .populate({ path: 'friends', select: '-__v -_id' });
        if (!user) {
            return res.status(404).json({ message: 'No user found in getUserById()' });
        }
        return res.json(user);
    } catch (error: any) {
        return res.status(500).json({ message: 'Error in getUserById(): ', error: error.message });
    }
}

// PUT User based on id /users/:userId
export const updateUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const userUpdate = await User.findOneAndUpdate(
            { _id: userId },
            { $set: req.body },
            { new: true }
        );
        if (!userUpdate) {
            return res.status(404).json({ message: 'No user found in updateUser()' });
        }
        return res.json(userUpdate);
    } catch (error: any) {
        return res.status(500).json({ message: 'Error in updateUser(): ', error: error.message });
    }
}

// DELETE User based on id /users/:userId
export const deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const userDelete = await User.findOneAndDelete({ _id: userId });
        if (!userDelete) {
            return res.status(404).json({ message: 'No user found in deleteUser()' });
        }
        await Thought.deleteMany({ username: userDelete.username });
        return res.json({ message: 'User successfully deleted including attached thoughts: ', userDelete });
    } catch (error: any) {
        return res.status(500).json({ message: 'Error in deleteUser(): ', error: error.message });
    }
}

// routes for /api/users/:userId/friends/:friendId ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// POST Friend based on /users/:userId/friends/:friendId
export const addFriend = async (req: Request, res: Response) => {
    const { userId, friendId } = req.params;
    try {
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $addToSet: { friends: friendId } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'No user found in addFriend()' });
        }
        return res.json(user);
    } catch (error: any) {
        return res.status(500).json({ message: "Error in addFriend(): ", error: error.message });
    }
}

// DELETE Friend based on /users/:userId/friends/:friendId
export const removeFriend = async (req: Request, res: Response) => {
    const { userId, friendId } = req.params;
    try {
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $pull: { friends: friendId } },
            { new: true }
        ).populate('friends');
        if (!user) {
            return res.status(404).json({ message: 'No user found in removeFriend()' });
        }
        return res.json(user);
    } catch (error: any) {
        return res.status(500).json({ message: 'Error in removeFriend(): ', error: error.message });
    }
}