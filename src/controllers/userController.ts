import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { User } from '../models/index.js';

// Aggregate function to get number of users overall
export const userCount = async () => {
    const numberOfUsers = await User.aggregate()
        .count('userCount');
    return numberOfUsers;
}

// Aggregate function for getting the overall grade using $avg
export const grade = async (userId: string) =>
    User.aggregate([
        // only include the given student by using $match
        { $match: { _id: new ObjectId(userId) } },
        {
            $unwind: '$assignments',
        },
        {
            $group: {
                _id: new ObjectId(userId),
                overallGrade: { $avg: '$assignments.score' },
            },
        },
    ]);

// TODO edit final
// GET for all users /users
export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await Student.find();

        const studentObj = {
            users,
            headCount: await headCount(),
        }

        res.json(userObj);
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
}

// TODO edit final
// GET for user by id /users/:id
export const getUserById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (user) {
            res.json({
                user,
                grade: await grade(userId)
            });
        } else {
            res.status(404).json({
                message: 'User not found'
            });
        }
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};

// POST  for new User /users
export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

// PUT User based on id /users/:id
export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
        );
    } catch (err) {
        res.status(500).json(err);
    }
}

// TODO edit final
// DELETE User based on id /users/:id
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const student = await User.findOneAndDelete({ _id: req.params.studentId });

        if (!student) {
            return res.status(404).json({ message: 'No such student exists' });
        }

        const course = await Course.findOneAndUpdate(
            { students: req.params.studentId },
            { $pull: { students: req.params.studentId } },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({
                message: 'User deleted, but no courses found',
            });
        }

        return res.json({ message: 'User successfully deleted' });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

/**
 * POST Assignment based on /students/:studentId/assignments
 * @param string id
 * @param object assignment
 * @returns object student 
*/

export const addFriend = async (req: Request, res: Response) => {
    console.log('You are adding an assignment');
    console.log(req.body);
    try {
        const student = await Student.findOneAndUpdate(
            { _id: req.params.studentId },
            { $addToSet: { assignments: req.body } },
            { runValidators: true, new: true }
        );

        if (!student) {
            return res
                .status(404)
                .json({ message: 'No student found with that ID :(' });
        }

        return res.json(student);
    } catch (err) {
        return res.status(500).json(err);
    }
}

/**
 * DELETE Assignment based on /students/:studentId/assignments
 * @param string assignmentId
 * @param string studentId
 * @returns object student 
*/

export const removeFriend = async (req: Request, res: Response) => {
    try {
        const student = await Student.findOneAndUpdate(
            { _id: req.params.studentId },
            { $pull: { assignments: { assignmentId: req.params.assignmentId } } },
            { runValidators: true, new: true }
        );

        if (!student) {
            return res
                .status(404)
                .json({ message: 'No student found with that ID :(' });
        }

        return res.json(student);
    } catch (err) {
        return res.status(500).json(err);
    }
}