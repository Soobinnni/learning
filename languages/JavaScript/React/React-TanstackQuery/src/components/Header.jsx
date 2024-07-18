import { useIsFetching } from "@tanstack/react-query";

export default function Header({ children }) {
  const isFetching = useIsFetching(); // 쿼리가 데이터를 가져오지 않으면 0, 가져오면 0초과로 늘어남
  return (
    <>
      <div id="main-header-loading">{isFetching>0 && <progress/>}</div>
      <header id="main-header">
        <div id="header-title">
          <h1>React Events</h1>
        </div>
        <nav>{children}</nav>
      </header>
    </>
  );
}
