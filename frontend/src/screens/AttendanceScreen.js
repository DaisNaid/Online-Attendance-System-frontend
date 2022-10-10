import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../store';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import Container from 'react-bootstrap/esm/Container';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, classe: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, successUpdate: true };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function AttendanceScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const { id } = useParams();
  const [{ loading, error, classe }, dispatch] = useReducer(reducer, {
    classe: [],
    loading: true,
    error: '',
  });
  const [otc, setOTC] = useState('');
  const check = classe.OTC;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/classes/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, [userInfo, id]);

  const attendHandler = async (classe) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      const { data } = await axios.put(
        `/api/classes/attend`,
        { student: userInfo._id, id: classe._id },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Check In Validated');
      navigate(`/`);
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'UPDATE_FAIL' });
      setTimeout(() => {
        navigate(`/`);
      }, 1000);
    }
  };

  return (
    <Container className="site-container">
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <Helmet>
            <title>Attend {classe._id}</title>
          </Helmet>
          <div className="welcome">
            <h2>Online Attendance System</h2>
            {classe.course.map((x) => (
              <ul key={x._id} className="details">
                <li>{x.code}</li>
                <li>{x.title}</li>
              </ul>
            ))}
            <div>
              <form>
                <div className="field">
                  <input
                    style={{ textTransform: 'uppercase' }}
                    placeholder="OTC"
                    type="text"
                    required
                    maxLength={6}
                    onChange={(e) => {
                      setOTC(e.target.value.toUpperCase());
                    }}
                  />
                  <Button
                    variant="success"
                    type="button"
                    disabled={otc !== check}
                    onClick={() => attendHandler(classe)}
                  >
                    Check-In
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
