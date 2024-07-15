import { redirect } from 'react-router-dom'
export function getAuthToken() {
    const token = localStorage.getItem('token');
    return token;
}

export function tokenLoader() {
    return getAuthToken();
}

export function checkAuthLoader() { // 인증이 필요한 라우트 보호하기 위한 함수
    const token = getAuthToken();

    if (!token) {
        return redirect('/auth');
    }

    return null;
}