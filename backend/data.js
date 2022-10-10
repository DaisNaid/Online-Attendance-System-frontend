import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      userID: 'M008',
      name: 'Tryve',
      password: bcrypt.hashSync('9999'),
      isAdmin: true,
      isLecturer: false,
      isStudent: false,
    },
    {
      userID: 'M9912',
      name: 'Mark Springett',
      password: bcrypt.hashSync('0000'),
      isAdmin: false,
      isLecturer: true,
      isStudent: false,
    },
    {
      userID: 'M9926',
      name: 'Joanna Loveday',
      password: bcrypt.hashSync('4444'),
      isAdmin: false,
      isLecturer: true,
      isStudent: false,
    },
    {
      userID: 'M0024',
      name: 'Tokyo Kyoto',
      password: bcrypt.hashSync('9999'),
      isAdmin: false,
      isLecturer: false,
      isStudent: true,
    },
  ],

  courses: [
    {
      code: 'CST101',
      title: 'UX Design',
      lecturer: '628a1719c3378c85ab0295cf',
    },
    {
      code: 'CST103',
      title: 'Business Intelligence',
      lecturer: '628a1719c3378c85ab0295d0',
    },
  ],
};
export default data;
