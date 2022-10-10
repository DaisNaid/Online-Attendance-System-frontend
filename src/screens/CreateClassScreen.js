import axios from 'axios';
import React, { useContext, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../store';
import { getError } from '../utils';
import { useNavigate, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function CreateClassScreen() {
  const navigate = useNavigate();

  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function generateOTC(length) {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const createClassHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST ' });
      const { data } = await axios.post(
        '/api/classes',
        { classe: cart.cartItems, id: userInfo._id, otc: generateOTC(6) },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/myclasses/${userInfo._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
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
            <h3>Class Details: </h3>
            {loading ? (
              <LoadingBox />
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              <div>
                <ul className="classlist">
                  {cart.cartItems.map((item) => (
                    <div key={item._id}>
                      <li>{item.code}</li>
                      <li>{item.title}</li>
                    </div>
                  ))}
                </ul>
                <div className="d">
                  <button type="button" onClick={createClassHandler}>
                    Create Class
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
