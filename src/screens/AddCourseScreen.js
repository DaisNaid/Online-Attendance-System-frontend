import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../store';
import { getError } from '../utils';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'LEC_REQUEST':
      return { ...state, loadingLec: true };
    case 'LEC_SUCCESS':
      return { ...state, lec: action.payload, loadingLec: false };
    case 'LEC_FAIL':
      return { ...state, loadingLec: false, error: action.payload };
    default:
      return state;
  }
};

export default function AddCourseScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [lecturer, setLecturer] = useState('');

  const [{ loading, error, loadingCreate, lec }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: '',
    }
  );

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

    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/courses/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setCode(data.code);
        setTitle(data.title);
        setLecturer(data.lecturer);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchLecturer();
    fetchData();
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      await axios.post(
        `/api/courses/`,
        { code, title, lecturer },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('Course created successfully');
      navigate('/admin');
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  return (
    <Container className="site-container">
      <Helmet>
        <title>Create Course</title>
      </Helmet>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <h1>Create Course</h1>
          <Form.Group className="mb-3" controlId="code">
            <Form.Label>Code</Form.Label>
            <Form.Control
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <label>
            <select onChange={(e) => setLecturer(e.target.value)}>
              {lec.map((x) => (
                <option key={x._id} value={x._id}>
                  {x.name}
                </option>
              ))}
            </select>
          </label>
          <div className="mb-3">
            <Button disabled={loadingCreate} type="submit">
              Create
            </Button>
            {loadingCreate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  );
}
