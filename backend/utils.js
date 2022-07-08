import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      userID: user.userID,
      name: user.name,
      isAdmin: user.isAdmin,
      isLecturer: user.isLecturer,
      isStudent: user.isStudent,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '360d',
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(
      token,
      process.env.JWT_SECRET || 'Makishima_1984',
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: 'Invalid Token' });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};

export const isLecturer = (req, res, next) => {
  if (req.user && req.user.isLecturer) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Lecturer Token' });
  }
};

export const isStudent = (req, res, next) => {
  if (req.user && req.user.isStudent) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Student Token' });
  }
};

export const isPermitted = (req, res, next) => {
  if ((req.user && req.user.isAdmin) || (req.user && req.user.isLecturer)) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Permission Token' });
  }
};
