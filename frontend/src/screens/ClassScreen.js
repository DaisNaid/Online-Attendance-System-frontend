import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/esm/Container';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import logger from 'use-reducer-logger';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, courses: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function ClassScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, courses }, dispatch] = useReducer(logger(reducer), {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/courses/getlec`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <Container className="site-container">
      <div>
        <Helmet>
          <title>Create Your Class</title>
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
              <ul className="classlist">
                <li>
                  {courses.map((course) => (
                    <div key={course._id}>
                      <Link
                        to={`/add-class/${course._id}`}
                        style={{ color: 'white' }}
                      >
                        <div>{course.title}</div>
                      </Link>
                    </div>
                  ))}
                </li>
              </ul>
            )}
          </div>
          <div>
            <Link to={`/myclasses/${userInfo._id}`}>
              <Button variant="secondary">My Classes</Button>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
