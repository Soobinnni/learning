import AuthForm from '../components/AuthForm';
import { json, redirect } from 'react-router-dom';

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export const action = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get('mode') || 'login'; //login이 default가 됨

  if( mode !== 'signup' && mode !== 'login') {
    throw json({message:'Unsupported mode.'},{status:422});
  }

  const data = await request.formData();
  const authData = JSON.stringify({
    email: data.get('email'),
    password: data.get('password'),
  });


  const response = await fetch(`http://localhost:8080/${mode}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body : authData
  })

  if (response.status === 422 || response.status === 401 ) {
    // 유효성 검사 오류, 인증되지 않은 사용자
    return response;
  }
  if (!response.ok) {
    throw json({ message: 'Could not authenticate user.' }, { status: 500 });
  }

  const resData = await response.json();
  const token = resData.token;

  // 토큰 저장. 토큰 관리를 위해 만료 시간도 함께 저장 
  const expiration = new Date();
  expiration.setHours(expiration.getHours()+1);

  localStorage.setItem('token', token);
  localStorage.setItem('expiration', expiration.toISOString());

  return redirect('/');
}