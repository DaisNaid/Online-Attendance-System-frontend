import express from 'express';
import expressAsyncHandler from 'express-async-handler';

const seedRouter = express.Router();

seedRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {})
);

export default seedRouter;
