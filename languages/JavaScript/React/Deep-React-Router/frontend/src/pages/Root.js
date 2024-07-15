import { Outlet, useLoaderData, useSubmit } from "react-router-dom";

import MainNavigation from '../components/MainNavigation.js'
import { useEffect } from "react";
import { getTokenDuration } from "../util/auth.js";

const RootLayout = () => {
    /**자동 로그아웃 기능 추가(백엔드 토큰 만료)
     * 
     * RootLayout은 모든 컴포넌트를 감싸고 있으므로 해당 기능을 처리하기에
     * 적절한 컴포넌트
     *  */
    const token = useLoaderData();
    const submit = useSubmit();
    useEffect(() => {
        if (!token) return;

        if (token === 'EXPIRED') {
            submit(null, { action: '/logout', method: 'post' });
        }

        const tokenDuration = getTokenDuration();
        setTimeout(() => {
          submit(null, { action: '/logout', method: 'post' });
        }, tokenDuration);

    }, [token, submit])
    return <>
        <MainNavigation />
        <main>
            <Outlet />
        </main>
    </>
};

export default RootLayout;