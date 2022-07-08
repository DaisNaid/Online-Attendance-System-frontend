import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Store } from '../store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Chart from 'react-google-charts';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { LinkContainer } from 'react-router-bootstrap';
import Container from 'react-bootstrap/esm/Container';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/classes/${userInfo._id}/summary`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <Container className="site-container">
      <div>
        <h1>Dashboard</h1>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <Row>
              <Col md={3}>
                <LinkContainer to="/lecturers">
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        {summary.lecturers && summary.lecturers[0]
                          ? summary.lecturers[0].numLecturers
                          : 0}
                      </Card.Title>
                      <Card.Text>Lecturers</Card.Text>
                    </Card.Body>
                  </Card>
                </LinkContainer>
              </Col>
              <Col md={3}>
                <LinkContainer to="/students">
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        {summary.students && summary.students[0]
                          ? summary.students[0].numStudents
                          : 0}
                      </Card.Title>
                      <Card.Text>Students</Card.Text>
                    </Card.Body>
                  </Card>
                </LinkContainer>
              </Col>
              <Col md={3}>
                <LinkContainer to="/courses">
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        {summary.courses && summary.courses[0]
                          ? summary.courses[0].numCourses
                          : 0}
                      </Card.Title>
                      <Card.Text>Courses</Card.Text>
                    </Card.Body>
                  </Card>
                </LinkContainer>
              </Col>
              <Col md={3}>
                <LinkContainer to="/createdclasses">
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        {summary.classes && summary.classes[0]
                          ? summary.classes[0].numClasses
                          : 0}
                      </Card.Title>
                      <Card.Text>Classes</Card.Text>
                    </Card.Body>
                  </Card>
                </LinkContainer>
              </Col>
              <Col
                md={2}
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: '10px',
                  textAlign: 'center',
                }}
              >
                <LinkContainer to="/create/user">
                  <Card>
                    <Card.Body>
                      <Card.Title></Card.Title>
                      <Card.Text>Add New User</Card.Text>
                    </Card.Body>
                  </Card>
                </LinkContainer>
              </Col>
              <Col
                md={2}
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: '10px',
                  textAlign: 'center',
                }}
              >
                <LinkContainer to="/create/course">
                  <Card>
                    <Card.Body>
                      <Card.Title></Card.Title>
                      <Card.Text>Add New Course</Card.Text>
                    </Card.Body>
                  </Card>
                </LinkContainer>
              </Col>
            </Row>
            <div className="my-3">
              <h2>Classes</h2>
              {summary.dailyClasses.length === 0 ? (
                <MessageBox>No Classes</MessageBox>
              ) : (
                <Chart
                  width="100%"
                  height="400px"
                  chartType="AreaChart"
                  loader={<div>Loading Chart...</div>}
                  data={[
                    ['Date', 'Classes'],
                    ...summary.dailyClasses.map((x) => [x._id, x.classes]),
                  ]}
                ></Chart>
              )}
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
