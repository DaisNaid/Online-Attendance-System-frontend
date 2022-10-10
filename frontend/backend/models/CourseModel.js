import mongoose from 'mongoose';

export const courseSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;
