import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Class from '../models/ClassModel.js';
import Course from '../models/CourseModel.js';
import User from '../models/UserModel.js';
import {
  isAdmin,
  isAuth,
  isLecturer,
  isPermitted,
  isStudent,
} from '../utils.js';

const classRouter = express.Router();

classRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const classes = await Class.find({}).populate('course');
    const newClasses = classes.reverse();
    res.send(newClasses);
  })
);

classRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const classe = await Class.findById(req.params.id)
      .populate('course')
      .populate('students');
    res.send(classe);
  })
);

classRouter.get(
  '/myclasses/:id',
  isAuth,
  isLecturer,
  expressAsyncHandler(async (req, res) => {
    const lec = await Course.find({ lecturer: req.params.id });
    const myclasses = await Class.find({ course: lec }).populate('course');
    const newMyClasses = myclasses.reverse();
    res.send(newMyClasses);
  })
);

classRouter.get(
  '/:id/attendance',
  expressAsyncHandler(async (req, res) => {
    const attendance = await Class.findById(req.params.id)
      .populate('course')
      .populate('students')
      .populate('presentStudents')
      .populate('absentStudents');
    res.send(attendance);
  })
);

classRouter.get(
  '/openclasses/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const courses = await Course.find({ students: req.params.id });
    res.send(courses);
  })
);

classRouter.get(
  '/check/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const classes = await Class.find({ course: req.params.id }).populate(
      'course'
    );
    const newClasses = classes.reverse();
    res.send(newClasses);
  })
);

classRouter.get(
  '/:id/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const classes = await Class.aggregate([
      {
        $group: {
          _id: null,
          numClasses: { $sum: 1 },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);

    const lecturers = await User.aggregate([
      {
        $match: { isLecturer: true },
      },
      {
        $group: {
          _id: null,
          numLecturers: { $sum: 1 },
        },
      },
    ]);

    const students = await User.aggregate([
      {
        $match: { isStudent: true },
      },
      {
        $group: {
          _id: null,
          numStudents: { $sum: 1 },
        },
      },
    ]);

    const dailyClasses = await Class.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          classes: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const courses = await Course.aggregate([
      {
        $group: {
          _id: null,
          numCourses: { $sum: 1 },
        },
      },
    ]);

    res.send({ classes, users, dailyClasses, lecturers, students, courses });
  })
);

classRouter.post(
  '/',
  isAuth,
  isLecturer,
  expressAsyncHandler(async (req, res) => {
    const course = await Course.find({ lecturer: req.body.id });
    const array = course.map((x) => x.students);
    const list = array[0];
    const newClass = new Class({
      course: req.body.classe,
      students: list,
      absentStudents: list,
      OTC: req.body.otc,
    });
    const classe = await newClass.save();
    res.status(201).send({ message: 'New Class Created', classe });
  })
);

classRouter.put(
  '/:id/toggle',
  isAuth,
  isPermitted,
  expressAsyncHandler(async (req, res) => {
    const classe = await Class.findById(req.params.id);
    if (classe) {
      classe.isOpen = !classe.isOpen;
      classe.save();
      res.send({ message: 'Status Changed' });
    }
  })
);

classRouter.put(
  '/attend',
  isAuth,
  isStudent,
  expressAsyncHandler(async (req, res) => {
    var array = new Array();
    const classe = await Class.findById(req.body.id);
    if (classe) {
      const current = req.body.student;
      array = classe.presentStudents;
      if (array.includes(current)) {
        res.status(404).send({ message: 'You are already checked in' });
      } else {
        array.push(current);
        classe.presentStudents = array;
        classe.absentStudents.pull(current);
        const updatedClass = await classe.save();
        res.send({ message: 'Class Updated', classe: updatedClass });
      }
    } else {
      res.status(404).send({ message: 'Class Not Found' });
    }
  })
);

classRouter.put(
  '/:id/mark',
  isAuth,
  isPermitted,
  expressAsyncHandler(async (req, res) => {
    const classe = await Class.findById(req.params.id);
    if (classe) {
      const current = req.body.student;
      array = classe.presentStudents;
      if (array.includes(current)) {
        res.status(404).send({ message: 'Student Already Checked In' });
      } else {
        array.push(current);
        classe.presentStudents = array;
        const updatedCourse = await classe.save();
        res.send({ message: 'Class Updated', course: updatedCourse });
      }
    } else {
      res.status(404).send({ message: 'Class Not Found' });
    }
  })
);

export default classRouter;
