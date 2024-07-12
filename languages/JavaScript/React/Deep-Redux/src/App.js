import { useEffect } from 'react';
import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import Notification from './components/UI/Notification.js';

import { useSelector, useDispatch } from 'react-redux';
import { uiActions } from './store/ui-slice.js';
import backendUrl from './backend.js'

let isInitial = true;

function App() {
  const dispatch = useDispatch();

  const showCart = useSelector(state => state.ui.cartIsVisible);
  const cart = useSelector(state => state.cart);
  const notification = useSelector(state => state.ui.notification);

  useEffect(() => {
    const sendCartData = async () => {
      dispatch(uiActions.showNotification({
        title: 'Sending...',
        status: 'pending',
        message: 'Sending cart data!'
      }));

      const response = await fetch(`${backendUrl}cart.json`, {
        method: 'PUT',
        body: JSON.stringify(cart)
      });
      if (!response.ok) {
        throw new Error('Sending cart data failed.');
      }

      dispatch(uiActions.showNotification({
        title: 'Success!',
        status: 'success',
        message: 'Sent cart data successfully!'
      }));
    }

    if(isInitial){
      isInitial=false;
      return;
    }

    sendCartData().catch(error => {
      dispatch(uiActions.showNotification({
        title: 'Error!',
        status: 'error',
        message: 'Sending cart data failed!'
      }));
    });
  }, [cart, dispatch])

  return (
    <>
    {
      notification && <Notification 
        status = {notification.status}
        title = {notification.title}
        message = {notification.message}
      />
    }
      <Layout>
        {
          showCart && <Cart />
        }
        <Products />
      </Layout>
    </>
  );
}

export default App;
