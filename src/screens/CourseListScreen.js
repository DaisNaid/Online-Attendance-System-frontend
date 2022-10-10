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
      return { ...state, lecturer: action.payload, loading: false };
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

export default function CourseListScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [
    { loadingCourse, error, course, lecturer, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loadingCourse: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/users/lecturers`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    const fetchCourse = async () => {
      try {
        dispatch({ type: 'COURSE_REQUEST' });
        const { data } = await axios.get(`/api/courses/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'COURSE_SUCCESS', payload: data });
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'COURSE_FAIL' });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
      fetchCourse();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (x) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/courses/${x._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Course deleted successfully');
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
          <title>Courses</title>
        </Helmet>
        <h2>Online Attendance System</h2>
        <div>
          <h3>Courses</h3>
          {loadingDelete && <LoadingBox></LoadingBox>}
          {loadingCourse ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>CODE</th>
                  <th>TITLE</th>
                  <th>LECTURER</th>
                  <th>DATE ADDED</th>
                </tr>
              </thead>
              <tbody>
                {course.map((x) => (
                  <tr key={x._id}>
                    <td>{x.code}</td>
                    <td>{x.title}</td>
                    <td>
                      {lecturer.map((lec) => (
                        <div key={lec._id}>
                          {lec._id === x.lecturer ? lec.name : <div></div>}
                        </div>
                      ))}
                    </td>
                    <td>{x.createdAt.substring(0, 10)}</td>
                    <td>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => navigate(`/course/${x._id}`)}
                      >
                        Edit
                      </Button>
                      &nbsp;
                      <Button
                        type="button"
                        variant="light"
                        onClick={() =>
                          navigate(`/course/${x._id}/add-students`)
                        }
                      >
                        Register Students
                      </Button>
                      &nbsp;
                      <Button
                        type="button"
                        variant="light"
                        onClick={() =>
                          navigate(`/course/${x._id}/remove-students`)
                        }
                      >
                        Unregister Students
                      </Button>
                      &nbsp;
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => deleteHandler(x)}
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
