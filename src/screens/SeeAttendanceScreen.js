import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Container from 'react-bootstrap/esm/Container';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, classes: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
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

export default function ClassListScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const { id } = useParams();
  const navigate = useNavigate();

  const [{ loading, error, classes }, dispatch] = useReducer(reducer, {
    loading: true,
    classes: {},
    error: '',
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/classes/${id}/attendance`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchClasses();
  }, [userInfo, id]);

  const markHandler = async (y) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/classes/${id}/mark`,
        { student: y._id },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Student Attendance Marked Successfully');
      navigate(`/${id}/attendance`);
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  return (
    <Container className="site-container">
      <div>
        <Helmet>
          <title>Classes</title>
        </Helmet>
        <h2>Online Attendance System</h2>
        <div>
          <h3>Class {classes._id}</h3>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th style={{ color: 'green' }}>PRESENT</th>
                  <th style={{ color: 'red' }}>ABSENT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {classes.presentStudents.map((x) => (
                      <div>
                        {x.userID} - {x.name}
                      </div>
                    ))}
                  </td>
                  <td>
                    {classes.absentStudents.map((y) => (
                      <div>
                        {y.userID} - {y.name}
                      </div>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Container>
  );
}
