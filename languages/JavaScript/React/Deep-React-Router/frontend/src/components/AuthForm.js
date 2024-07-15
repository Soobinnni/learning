import {
  Form,
  Link,
  useSearchParams,
  json, redirect
} from 'react-router-dom';

import classes from './AuthForm.module.css';

function AuthForm() {
  // searchParams는 URL의 쿼리 파라미터를 읽는 객체.
  // setSearchParams는 쿼리 파라미터를 설정하는 함수.
  const [searchParams, setSearchParams] = useSearchParams();

  // 쿼리 파라미터 읽기
  const isLogin = searchParams.get('mode') === 'login';

  /* 쿼리 파라미터 설정하기
  const updateSearchParams = () => {
    setSearchParams({ paramKey: 'newValue' });
  }; */
  return (
    <>
      <Form method="post" className={classes.form}>
        <h1>{isLogin ? 'Log in' : 'Create a new user'}</h1>
        <p>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
        </p>
        <p>
          <label htmlFor="image">Password</label>
          <input id="password" type="password" name="password" required />
        </p>
        <div className={classes.actions}>
          <Link to={`?mode=${isLogin ? 'signup':'login'}`}>
          {isLogin ? 'Create new user' : 'Login'}
        </Link>
        <button>Save</button>
      </div>
    </Form >
    </>
  );
}

export default AuthForm;