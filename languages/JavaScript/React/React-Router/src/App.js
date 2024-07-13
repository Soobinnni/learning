import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/Root.js";
import HomePage from "./pages/Home.js";
import ProductsPage from "./pages/Products.js";
import ProductDetailPage from "./pages/ProductDetail.js";
import ErrorPage from "./pages/Error.js";

function App() {
  const router = createBrowserRouter([
    {
      path: '/', 
      element: <RootLayout />,
      errorElement : <ErrorPage />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'products/:productId', element: <ProductDetailPage /> },
      ]
    },
  ])


  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
