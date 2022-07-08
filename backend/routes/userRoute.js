import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/UserModel.js';
import { generateToken, isAdmin, isAuth } from '../utils.js';
//import data from '../data.js';
import Course from '../models/CourseModel.js';

const userRouter = express.Router();

/*userRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    //await User.remove({});
    const createdUsers = await User.insertMany(data.users);
    res.send(createdUsers);
  })
);*/

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.get(
  '/lecturers',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const lecturers = await User.find({ isLecturer: true });
    res.send(lecturers);
  })
);

userRouter.get(
  '/students',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const students = await User.find({ isStudent: true });
    res.send(students);
  })
);

userRouter.get(
  '/lecturer/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const lecturers = await User.findById(req.params.id);
    res.send(lecturers);
  })
);

userRouter.get(
  '/lecturer_course',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.find({ isLecturer: true });
    if (user) {
      const identifier = user._id;
      const lec = await Course.find({ lecturers: identifier });
      res.send(lec);
    } else {
      res.status(404).send({ message: 'Lecturer Not Found' });
    }
  })
);

userRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      userID: req.body.userID,
      name: req.body.name,
      password: bcrypt.hashSync(req.body.password, 8),
      isAdmin: Boolean(req.body.isAdmin),
      isLecturer: Boolean(req.body.isLecturer),
      isStudent: Boolean(req.body.isStudent),
    });
    const newUser = await user.save();
    res.send({ message: 'User Created', newUser });
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ userID: req.body.userID });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          userID: user.userID,
          name: user.name,
          isAdmin: user.isAdmin,
          isLecturer: user.isLecturer,
          isStudent: user.isStudent,
          token: generateToken(user),
        });
      }
      return;
    } else {
      res.status(401).send({ message: 'Invalid UserID or Password' });
    }
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.isAdmin = Boolean(req.body.isAdmin);
      user.isLecturer = Boolean(req.body.isLecturer);
      user.isStudent = Boolean(req.body.isStudent);
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.isAdmin === true) {
        res.status(400).send({ message: 'Cannot Authenticate Admin Deletion' });
        return;
      }
      await user.remove();
      res.send({ message: 'User Deleted' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

export default userRouter;
