import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoute.js';
import userRouter from './routes/userRoute.js';
import classRouter from './routes/classRoute.js';
import courseRouter from './routes/courseRoute.js';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL || 'mongodb://localhost/OAS_X')
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/seed', seedRouter);
app.use('/api/users', userRouter);
app.use('/api/classes', classRouter);
app.use('/api/courses', courseRouter);

/*app.get('/api/otc', (req, res) => {
  var otc = Math.floor(100000 + Math.random() * 900000);
  res.send(otc + '');
});*/
app.get('/', (req, res) => {
  res.send('Server Deployed!');
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});
