import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../store';
import { getError } from '../utils';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, course: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'LEC_REQUEST':
      return { ...state, loadingLec: true };
    case 'LEC_SUCCESS':
      return { ...state, lec: action.payload, loadingLec: false };
    case 'LEC_FAIL':
      return { ...state, loadingLec: false, error: action.payload };
    case 'STU_REQUEST':
      return { ...state, loadingStu: true };
    case 'STU_SUCCESS':
      return { ...state, stu: action.payload, loadingStu: false };
    case 'STU_FAIL':
      return { ...state, loadingStu: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function AddStudenttoCourseScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const { id } = useParams();
  const navigate = useNavigate();

  const [{ loading, error, course, lec, stu, loadingUpdate }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  useEffect(() => {
    const fetchLecturer = async () => {
      try {
        dispatch({ type: 'LEC_REQUEST' });
        const { data } = await axios.get(`/api/users/lecturers`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'LEC_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'LEC_FAIL', payload: getError(err) });
      }
    };
    fetchLecturer();

    const fetchStudents = async () => {
      try {
        dispatch({ type: 'STU_REQUEST' });
        const { data } = await axios.get(`/api/users/students`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'STU_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'STU_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchStudents();

    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo, id]);

  const addHandler = async (y) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/courses/${id}/students`,
        { x: y._id },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Student Added Successfully');
      navigate(`/course/${id}/add-students`);
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      toast.success('Course updated successfully');
      navigate('/admin');
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <Container className="site-container">
      <Helmet>
        <title>Add Students to Course ${id}</title>
      </Helmet>
      <h1>Add Students to Course {id}</h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <ul>Course Code: {course.code}</ul>
          <ul>Course Title: {course.title}</ul>
          {lec.map((x) => (
            <div key={x._id}>
              {x._id === course.lecturer ? (
                <ul>Lecturer: {x.name}</ul>
              ) : (
                <div></div>
              )}
            </div>
          ))}
          <table className="table">
            <thead>
              <tr>
                <th>STUDENT</th>
                <th>ENROLLED DATE</th>
              </tr>
            </thead>
            <tbody>
              {stu.map((y) => (
                <tr key={y._id}>
                  <td>{y.name}</td>
                  <td>{y.createdAt.substring(0, 10)}</td>
                  <td>
                    <Button
                      type="button"
                      variant="success"
                      onClick={() => addHandler(y)}
                    >
                      Add
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mb-3">
            <Button
              disabled={loadingUpdate}
              type="submit"
              onClick={submitHandler}
            >
              Update
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
          </div>
        </div>
      )}
    </Container>
  );
}
