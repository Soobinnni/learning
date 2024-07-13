import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/Home.js";
import ProductsPage from "./pages/ProductsPage.js";

function App() {
  const router = createBrowserRouter([
    { path: '/', element: <HomePage /> },
    { path: '/products', element: <ProductsPage /> },
  ])


  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
