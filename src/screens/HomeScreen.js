import React, { useContext } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/esm/Container';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Store } from '../store';

export default function HomeScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
  };

  return (
    <Container className="site-container">
      <Helmet>
        <title>Online Attendance System</title>
      </Helmet>
      <div className="welcome">
        <h2>Online Attendance System</h2>
        <ul className="users">
          {userInfo ? (
            <div>
              <h3>Welcome {userInfo.name}</h3>
              {userInfo && userInfo.isStudent && (
                <div>
                  <Link to={`/opencourses/:${userInfo.userID}`}>
                    <Button variant="light" className="attendBtn">
                      Proceed
                    </Button>
                  </Link>
                </div>
              )}
              {userInfo && userInfo.isAdmin && (
                <div>
                  <Link to="/admin">
                    <Button variant="light" className="attendBtn">
                      Proceed
                    </Button>
                  </Link>
                </div>
              )}
              {userInfo && userInfo.isLecturer && (
                <div>
                  <Link to={`/class/:${userInfo.userID}`}>
                    <Button variant="light" className="attendBtn">
                      Proceed
                    </Button>
                  </Link>
                </div>
              )}
              <div className="signout">
                <Link to="#signout" onClick={signoutHandler}>
                  Sign Out
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <li>
                <Link to="/signin">
                  <i className="fas fa-user"> Admin</i>
                </Link>
              </li>
              <li>
                <Link to="/signin">
                  <i className="fas fa-user"> Lecturer</i>
                </Link>
              </li>
              <li>
                <Link to="/signin">
                  <i className="fas fa-user"> Student</i>
                </Link>
              </li>
            </div>
          )}
        </ul>
      </div>
    </Container>
  );
}
