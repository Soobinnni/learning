import Counter from './components/Counter.js';
import Header from './components/Header.js'
import Auth from './components/Auth.js'
import UserProfile from './components/UserProfile.js'

import { useSelector } from 'react-redux';

function App() {
  const isAuth = useSelector(state=>state.auth.isAuthenticated);
  return (
    <>
      <Header />
      {!isAuth && <Auth />}
      {isAuth && <UserProfile/>}
      <Counter />
    </>
  );
}

export default App;
