import mongoose from 'mongoose';

export const classSchema = new mongoose.Schema(
  {
    isOpen: { type: Boolean, default: false },
    OTC: { type: String, required: true },
    course: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
    ],
    presentStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
    ],
    absentStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Class = mongoose.model('Class', classSchema);
export default Class;
