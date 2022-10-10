import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Container from 'react-bootstrap/Container';
import AttendanceScreen from './screens/AttendanceScreen';
import HomeScreen from './screens/HomeScreen';
import NoPageScreen from './screens/NoPageScreen';
import OpenCourseScreen from './screens/OpenCourseScreen';
import SigninScreen from './screens/SigninScreen';
import CreateClassScreen from './screens/CreateClassScreen';
import ClassScreen from './screens/ClassScreen';
import AddClassScreen from './screens/AddClassScreen';
import SeeAttendanceScreen from './screens/SeeAttendanceScreen';
import ClassListScreen from './screens/ClassListScreen';
import MyClassListScreen from './screens/MyClassListScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProtectedRoute from './components/ProtectedRoute';
import LecturerListScreen from './screens/LecturerListScreen';
import LecturerEditScreen from './screens/LecturerEditScreen';
import AddUserScreen from './screens/AddUserScreen';
import AddCourseScreen from './screens/AddCourseScreen';
import CourseListScreen from './screens/CourseListScreen';
import CourseEditScreen from './screens/CourseEditScreen';
import StudentListScreen from './screens/StudentListScreen';
import AddStudenttoCourseScreen from './screens/AddStudenttoCourseScreen';
import RemoveStudentScreen from './screens/RemoveStudentScreen';
import CheckClassScreen from './screens/CheckClassScreen';

function App() {
  return (
    <Router>
      <div className="site-container">
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <div className="social-call">
            <div className="title">
              <a href="/">OAS</a>
            </div>
          </div>
        </header>
        <main>
          <Container>
            <Routes>
              <Route path="/signin" element={<SigninScreen />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <DashboardScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create/user"
                element={
                  <ProtectedRoute>
                    <AddUserScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create/course"
                element={
                  <ProtectedRoute>
                    <AddCourseScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/class/:id"
                element={
                  <ProtectedRoute>
                    <ClassScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/check/:id"
                element={
                  <ProtectedRoute>
                    <CheckClassScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-class/:id"
                element={
                  <ProtectedRoute>
                    <AddClassScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/createdclasses"
                element={
                  <ProtectedRoute>
                    <ClassListScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lecturers"
                element={
                  <ProtectedRoute>
                    <LecturerListScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <ProtectedRoute>
                    <StudentListScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <CourseListScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lecturer/:id"
                element={
                  <ProtectedRoute>
                    <LecturerEditScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/course/:id"
                element={
                  <ProtectedRoute>
                    <CourseEditScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/course/:id/add-students"
                element={
                  <ProtectedRoute>
                    <AddStudenttoCourseScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/course/:id/remove-students"
                element={
                  <ProtectedRoute>
                    <RemoveStudentScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/myclasses/:id"
                element={
                  <ProtectedRoute>
                    <MyClassListScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/createclass"
                element={
                  <ProtectedRoute>
                    <CreateClassScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/st-attendance/:id"
                element={
                  <ProtectedRoute>
                    <AttendanceScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/:id/attendance"
                element={
                  <ProtectedRoute>
                    <SeeAttendanceScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/opencourses/:id"
                element={
                  <ProtectedRoute>
                    <OpenCourseScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomeScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NoPageScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <span className="copyright">&copy; Copyright 2022 - OAS</span>
        </footer>
      </div>
    </Router>
  );
}

export default App;
