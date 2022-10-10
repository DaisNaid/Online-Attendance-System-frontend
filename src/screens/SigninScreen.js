import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../store';
import { getError } from '../utils';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/esm/Button';

export default function SigninScreen() {
  const navigate = useNavigate();

  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users/signin', {
        userID,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  return (
    <Container className="site-container">
      <div className="d-flex">
        <Helmet>
          <title>Log In</title>
        </Helmet>
        <Form className="rounded p-4 p-sm3" onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="userID">
            <Form.Label>User ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter User ID"
              onChange={(e) => setUserID(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button variant="light" type="submit">
              Log In
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}
