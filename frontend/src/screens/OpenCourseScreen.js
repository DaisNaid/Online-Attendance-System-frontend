import React, { useContext, useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from 'use-reducer-logger';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../store';
import Container from 'react-bootstrap/esm/Container';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, classes: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OpenCourseScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, classes }, dispatch] = useReducer(logger(reducer), {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(
          `/api/classes/openclasses/${userInfo._id}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, [userInfo, userInfo._id]);

  return (
    <Container className="site-container">
      <div>
        <Helmet>
          <title>Your Courses</title>
        </Helmet>
        <div className="welcome">
          <h2>Online Attendance System</h2>
          <div>
            <h3>Your Courses: </h3>
            {loading ? (
              <LoadingBox />
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              <div>
                {classes.map((course) => (
                  <ul key={course._id}>
                    <Link
                      to={`/check/${course._id}`}
                      style={{ color: 'white' }}
                    >
                      <li>{course.title}</li>
                    </Link>
                  </ul>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
