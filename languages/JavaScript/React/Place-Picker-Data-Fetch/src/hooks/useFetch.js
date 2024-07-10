import { useEffect, useState } from "react";

export function useFetch(fetchFn, initialValue) { // fetch 함수를 인자로 받음
  const [fetchedData, setFetchedData] = useState(initialValue);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const data = await fetchFn();
        setFetchedData(data);
      } catch (error) {
        setError({
          message: error.message || 'Failed to fetch data.'
        })
      }
      setIsFetching(false);
    }
    fetchData();
  }, [fetchFn]);

  return {
    isFetching,
    
    fetchedData, setFetchedData, // 업데이트 함수도 return하여 값을 수정할 수 있게 함.
                                // 수정 전 유효성 검사 로직도 이 곳에 추가할 수 있게 됨.

    error
  }
}