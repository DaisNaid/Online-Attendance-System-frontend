import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Course from '../models/CourseModel.js';
import { isAdmin, isAuth } from '../utils.js';

const courseRouter = express.Router();

courseRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const courses = await Course.find({});
    res.send(courses);
  })
);

courseRouter.get(
  '/students',
  expressAsyncHandler(async (req, res) => {
    const students = await Course.find({}).populate('students');
    res.send(students);
  })
);

courseRouter.get(
  '/getlec',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const lec = await Course.find({ lecturer: req.user._id });
    res.send(lec);
  })
);

courseRouter.get(
  '/:id/registeredstudents',
  expressAsyncHandler(async (req, res) => {
    const students = await Course.findById(req.params.id).populate('students');
    res.send(students);
  })
);

courseRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (course) {
      res.send(course);
    } else {
      res.status(404).send({ message: 'Course Not Found' });
    }
  })
);

courseRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const course = new Course({
      code: req.body.code,
      title: req.body.title,
      lecturer: req.body.lecturer,
    });
    const newCourse = await course.save();
    res.send({ message: 'User Created', newCourse });
  })
);

courseRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const course = await Course.findById(req.body._id);
    if (course) {
      course.code = req.body.code || course.code;
      course.title = req.body.title || course.title;
      course.lecturer = req.body.lecturer || course.lecturer;
      const updatedCourse = await course.save();
      res.send({ message: 'Course Updated', course: updatedCourse });
    } else {
      res.status(404).send({ message: 'Course Not Found' });
    }
  })
);

var array = new Array();

courseRouter.put(
  '/:id/students',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (course) {
      const current = req.body.x;
      array = course.students;
      if (array.includes(current)) {
        res.status(404).send({ message: 'Student Already Added' });
      } else {
        array.push(req.body.x);
        course.students = array;
        const updatedCourse = await course.save();
        res.send({ message: 'Course Updated', course: updatedCourse });
      }
    } else {
      res.status(404).send({ message: 'Course Not Found' });
    }
  })
);

courseRouter.put(
  '/unregister/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const course = await Course.findOneAndUpdate(
      { _id: req.body.courseID },
      { $pull: { students: req.params.id } }
    );
    res.send(course);
  })
);

courseRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (course) {
      await course.remove();
      res.send({ message: 'Course Deleted' });
    } else {
      res.status(404).send({ message: 'Course Not Found' });
    }
  })
);

export default courseRouter;
