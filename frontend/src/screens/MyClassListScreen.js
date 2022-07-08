import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Container from 'react-bootstrap/esm/Container';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
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
    case 'TOGGLE_REQUEST':
      return { ...state, loadingToggle: true };
    case 'TOGGLE_SUCCESS':
      return { ...state, loadingToggle: false, successToggle: true };
    case 'TOGGLE_FAIL':
      return { ...state, loadingToggle: false };
    case 'COPY_REQUEST':
      return { ...state, loadingCopy: true };
    case 'COPY_SUCCESS':
      return { ...state, loadingCopy: false, successCopy: true };
    case 'COPY_FAIL':
      return { ...state, loadingCopy: false };
    case 'TOGGLE_RESET':
      return { ...state, loadingToggle: false, successToggle: false };
    default:
      return state;
  }
};

export default function MyClassListScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const { id } = useParams();

  const [{ loading, error, classes, successToggle }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      classes: {},
      error: '',
    }
  );

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/classes/myclasses/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (successToggle) {
      dispatch({ type: 'TOGGLE_RESET' });
    } else {
      fetchClasses();
    }
  }, [userInfo, id, successToggle]);

  async function toggleClassHandler(classe) {
    try {
      dispatch({ type: 'TOGGLE_REQUEST' });
      const { data } = await axios.put(
        `/api/classes/${classe._id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'TOGGLE_SUCCESS', payload: data });
      toast.success('Class status changed');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'TOGGLE_FAIL' });
    }
  }

  return (
    <Container className="site-container">
      <div>
        <Helmet>
          <title>Classes</title>
        </Helmet>
        <h2>Online Attendance System</h2>
        <div>
          <h3>My Classes</h3>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>COURSE</th>
                  <th>DATE</th>
                  <th>TIME</th>
                  <th>OTC</th>
                  <th>OPEN</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classe) => (
                  <tr key={classe._id}>
                    <td>{classe._id}</td>
                    <td>
                      {classe.course.map((x) => (
                        <div key={x._id}>{x.title}</div>
                      ))}
                    </td>
                    <td>{classe.createdAt.substring(0, 10)}</td>
                    <td>{classe.createdAt.substring(11, 16)}</td>
                    <td>{classe.OTC}</td>
                    <td>
                      {classe.isOpen === false ? (
                        <b style={{ color: 'red' }}>Closed</b>
                      ) : (
                        <b style={{ color: 'green' }}>Open</b>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => toggleClassHandler(classe)}
                      >
                        Open/Close
                      </button>
                    </td>
                    <td>
                      <Link to={`/${classe._id}/attendance`}>
                        <button type="button">View Attendance</button>
                      </Link>
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
