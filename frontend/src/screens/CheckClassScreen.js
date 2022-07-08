import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/esm/Container';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
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
    default:
      return state;
  }
};

export default function CheckClassScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const { id } = useParams();

  const [{ loading, error, classes }, dispatch] = useReducer(reducer, {
    loading: true,
    classes: {},
    error: '',
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/classes/check/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchClasses();
  }, [userInfo, id]);

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
                  <th>COURSE</th>
                  <th>DATE</th>
                  <th>TIME</th>
                </tr>
              </thead>
              {classes.length === 0 ? (
                <div>No Classes</div>
              ) : (
                classes.map((classe) => (
                  <tbody key={classe._id}>
                    {classe.isOpen === true ? (
                      <tr>
                        <td>
                          {classe.course.map((x) => (
                            <div key={x._id}>{x.title}</div>
                          ))}
                        </td>
                        <td>{classe.createdAt.substring(0, 10)}</td>
                        <td>{classe.createdAt.substring(11, 16)}</td>
                        {classe.presentStudents.includes(userInfo._id) ? (
                          <td>
                            <Button disabled variant="success">
                              Attended
                            </Button>
                          </td>
                        ) : (
                          <td>
                            <Link to={`/st-attendance/${classe._id}`}>
                              <Button variant="success">Attend</Button>
                            </Link>
                          </td>
                        )}
                      </tr>
                    ) : (
                      <tr>
                        <td>
                          {classe.course.map((x) => (
                            <div key={x._id}>{x.title}</div>
                          ))}
                        </td>
                        <td>{classe.createdAt.substring(0, 10)}</td>
                        <td>{classe.createdAt.substring(11, 16)}</td>
                        <td>
                          <Button variant="danger" disabled>
                            Closed
                          </Button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                ))
              )}
            </table>
          )}
        </div>
      </div>
    </Container>
  );
}
