// TODO edit final
import { Request, Response } from 'express';
import { Thought } from '../models/index.js';

// GET All Thoughts /thoughts
export const getAllThoughts = async (_req: Request, res: Response) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
}

// GET Thought based on id /thought/:id
export const getThoughtById = async (req: Request, res: Response) => {
    const { thoughtId } = req.params;
    try {
        const thought = await Thought.findById(thoughtId);
        if (thought) {
            res.json(thought);
        } else {
            res.status(404).json({
                message: 'Thought not found'
            });
        }
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};

// POST Thought /thoughts
export const createThought = async (req: Request, res: Response) => {
    const { thought } = req.body;
    try {
        const newThought = await Thought.create({
            thought
        });
        res.status(201).json(newThought);
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        });
    }
};

// PUT Thought based on id /thoughts/:id
export const updateThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if (!thought) {
            res.status(404).json({ message: 'No thought with this id!' });
        }

        res.json(thought)
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        });
    }
};

// DELETE Thought based on id /thoughts/:id
export const deleteThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

        if (!thought) {
            res.status(404).json({
                message: 'No thought with that ID'
            });
        } else {
            await Student.deleteMany({ _id: { $in: thought.students } });
            res.json({ message: 'Thought and students deleted!' });
        }

    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};

// POST Reaction to Thought based on Thought id /thoughts/:id/reactions
export const createReaction = async (req: Request, res: Response) => {
    try {

    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};

// DELETE Thought based on id /thoughts/:id
export const deleteReaction = async (req: Request, res: Response) => {
    try {

    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};