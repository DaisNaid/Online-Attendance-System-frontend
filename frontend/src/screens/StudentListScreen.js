import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../store';
import { getError } from '../utils';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, users: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'COURSE_REQUEST':
      return { ...state, loadingCourse: true };
    case 'COURSE_SUCCESS':
      return { ...state, course: action.payload, loadingCourse: false };
    case 'COURSE_FAIL':
      return { ...state, loadingCourse: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function StudentListScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [
    { loading, error, users, course, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        dispatch({ type: 'COURSE_REQUEST' });
        const { data } = await axios.get(`/api/users/lecturer_course`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'COURSE_SUCCESS', payload: data });
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'COURSE_FAIL' });
      }
    };

    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/users/students`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchCourse();
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (student) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/users/${student._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('user deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  return (
    <Container className="site-container">
      <div>
        <Helmet>
          <title>Students</title>
        </Helmet>
        <h2>Online Attendance System</h2>
        <div>
          <h3>Students</h3>
          {loadingDelete && <LoadingBox></LoadingBox>}
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>LECTURER_ID</th>
                  <th>NAME</th>
                  <th>COURSE(S)</th>
                  <th>DATE ADDED</th>
                </tr>
              </thead>
              <tbody>
                {users.map((student) => (
                  <tr key={student._id}>
                    <td>{student.userID}</td>
                    <td>{student.name}</td>
                    <td>
                      {course.map((x) => (
                        <div key={x._id}>
                          {x.students.includes(student._id) ? (
                            x.title
                          ) : (
                            <div></div>
                          )}
                        </div>
                      ))}
                    </td>
                    <td>{student.createdAt.substring(0, 10)}</td>
                    <td>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => navigate(`/lecturer/${student._id}`)}
                      >
                        Edit
                      </Button>
                      &nbsp;
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => deleteHandler(student)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Container>
  );
}
