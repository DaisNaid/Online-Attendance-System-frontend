import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Container from 'react-bootstrap/esm/Container';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
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
      return { ...state, course: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function AddClassScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const { id } = useParams();
  const navigate = useNavigate();

  const [{ loading, error, course }, dispatch] = useReducer(logger(reducer), {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo, id]);

  const addToCartHandler = async () => {
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...course },
    });
    navigate('/createclass');
  };

  return (
    <Container className="site-container">
      <div>
        <Helmet>
          <title>Create Your Class</title>
        </Helmet>
        <div className="welcome">
          <h2>Online Attendance System</h2>
          <div>
            <h3>Creating Your Class: </h3>
            {loading ? (
              <LoadingBox />
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              <div>
                <ul className="classlist">
                  <li>Class Name: {course.title}</li>
                  <li>Class Module Code: {course.code}</li>
                  <li>Attendance Code: TBA</li>
                </ul>
                <div className="d">
                  <button type="button" onClick={addToCartHandler}>
                    Add to Classes to be Created
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
