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
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    default:
      return state;
  }
};

export default function AddUserScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [userID, setUserID] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState('');
  const [isLecturer, setIsLecturer] = useState('');
  const [isStudent, setIsStudent] = useState('');

  const [{ loading, error, loadingCreate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/users/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setUserID(data.userID);
        setName(data.name);
        setIsAdmin(data.isAdmin);
        setIsLecturer(data.isLecturer);
        setIsStudent(data.isStudent);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      await axios.post(
        `/api/users/`,
        { userID, name, password, isAdmin, isLecturer, isStudent },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('User created successfully');
      navigate('/admin');
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  return (
    <Container className="site-container">
      <Helmet>
        <title>Create User</title>
      </Helmet>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <h1>Create User</h1>
          <Form.Group className="mb-3" controlId="userID">
            <Form.Label>
              UserID{' '}
              <span style={{ color: 'red' }}>
                (Cannot be changed once created)
              </span>
            </Form.Label>
            <Form.Control
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>
              Password <span>(Suggestion: '0000' for new users)</span>
            </Form.Label>
            <Form.Control
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Check
            className="mb-3"
            type="checkbox"
            id="isAdmin"
            label="isAdmin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          <Form.Check
            className="mb-3"
            type="checkbox"
            id="isLecturer"
            label="isLecturer"
            checked={isLecturer}
            onChange={(e) => setIsLecturer(e.target.checked)}
          />
          <Form.Check
            className="mb-3"
            type="checkbox"
            id="isStudent"
            label="isStudent"
            checked={isStudent}
            onChange={(e) => setIsStudent(e.target.checked)}
          />
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
