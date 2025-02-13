import { Request, Response } from 'express';
import { User, Thought } from '../models/index.js';

// routes for /api/thoughts ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// GET All Thoughts /thoughts
export const getAllThoughts = async (_req: Request, res: Response) => {
    try {
        const thoughts = await Thought.find().select('-__v'); // exclude __v field, we don't need to check version key when reporting a thought document
        res.json(thoughts);
    } catch (error: any) {
        res.status(500).json({ message: 'Error in getAllThoughts(): ', error: error.message });
    }
}

// POST Thought /thoughts
export const createThought = async (req: Request, res: Response) => {
    try {
        const newThought = await Thought.create(req.body);
        await User.findOneAndUpdate({ username: newThought.username }, { $push: { thoughts: newThought._id } });
        res.status(201).json(newThought);
    } catch (error: any) {
        res.status(400).json({ message: 'Error in createThought(): ', error: error.message });
    }
};

// routes for /api/thoughts/:thoughtId ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// GET Thought based on id /thought/:id
export const getThoughtById = async (req: Request, res: Response) => {
    const { thoughtId } = req.params;
    try {
        const thought = await Thought.findById(thoughtId)
            .select('-__v') // exclude __v field, we don't need to check version key when reporting a user document
            .select('-_id'); // we send the id to get this one, we don't need to report the id again
        if (!thought) {
            return res.status(404).json({ message: 'No thought found in getThoughtById()' });
        }
        return res.json(thought);
    } catch (error: any) {
        return res.status(500).json({ message: 'Error in getThoughtById(): ', error: error.message });
    }
};

// PUT Thought based on id /thoughts/:id
export const updateThought = async (req: Request, res: Response) => {
    const { thoughtId } = req.params;
    try {
        const thoughtUpdate = await Thought.findOneAndUpdate(
            { _id: thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        );
        if (!thoughtUpdate) {
            return res.status(404).json({ message: 'No thought found in updateThought()' });
        }
        return res.json(thoughtUpdate);
    } catch (error: any) {
        return res.status(400).json({ message: 'Error in updateThought(): ', error: error.message });
    }
};

// DELETE Thought based on id /thoughts/:id
export const deleteThought = async (req: Request, res: Response) => {
    const { thoughtId } = req.params;
    try {
        const thoughtDelete = await Thought.findOneAndDelete({ _id: thoughtId });
        if (!thoughtDelete) {
            return res.status(404).json({ message: 'No thought found in deleteThought()' });
        }
        const userThoughtDelete = await User.findOneAndUpdate(
            { username: thoughtDelete.username },
            { $pull: { thoughts: thoughtId } },
            { new: true }
        );
        return res.json({ message: 'Thought successfully deleted and removed from user: ', thoughtDelete, userThoughtDelete });
    } catch (error: any) {
        return res.status(500).json({ message: 'Error in deleteThought(): ', error: error.message });
    }
};

// routes for /api/thoughts/:thoughtId/reactions ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// POST Reaction to Thought based on Thought id /thoughts/:thoughtId/reactions
export const createReaction = async (req: Request, res: Response) => {
    const { thoughtId } = req.params;
    try {
        const thoughtUpdate = await Thought.findOneAndUpdate(
            { _id: thoughtId },
            { $push: { reactions: req.body } },
            { new: true }
        );
        if (!thoughtUpdate) {
            return res.status(404).json({ message: 'No thought found in createReaction()' });
        }
        return res.json(thoughtUpdate);
    } catch (error: any) {
        return res.status(500).json({ message: 'Error in createReaction(): ', error: error.message });
    }
};

// DELETE Reaction to Thought based on Thought id /thoughts/:thoughtId/reactions
export const deleteReaction = async (req: Request, res: Response) => {
    const { thoughtId } = req.params;
    const { reactionId } = req.body;
    try {
        const thoughtUpdate = await Thought.findOneAndUpdate(
            { _id: thoughtId },
            { $pull: { reactions: { reactionId } } },
            { new: true }
        );
        if (!thoughtUpdate) {
            return res.status(404).json({ message: 'No thought found in deleteReaction()' });
        }
        return res.json(thoughtUpdate);
    } catch (error: any) {
        return res.status(500).json({ message: 'Error in deleteReaction(): ', error: error.message });
    }
};