import { useCallback, useEffect, useState } from "react";

async function sendHttpRequest(url, config) {
    const request = await fetch(url, config);
    const resData = await request.json();

    // 오류 처리
    if (!request.ok) {
        throw new Error(
            resData.message || 'Something went wrong, failed to send request.'
        );
    }

    return resData;
}

export default function useHttp(url, config, initialData) {
    const [data, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const sendRequest = useCallback(async () => {
        setIsLoading(true);
        try {
            const resData = await sendHttpRequest(url, config);
            setData(resData);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false); // fetch에 성공하든, 안하든 로딩이 끝났으므로
        }
    }, [url, config]);

    useEffect(() => {
        if(config && (config.method==='GET' || !config.method) || !config){
            sendRequest();
        }
    }, [sendRequest, config]);

    return {
        data,
        isLoading,
        error,
        sendRequest
    }
}