import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/Root.js";
import HomePage from "./pages/Home.js";
import ProductsPage from "./pages/Products.js";

function App() {
  const router = createBrowserRouter([
    {
      path: '/', element: <RootLayout />,
      children: [
        { path: '', element: <HomePage /> },
        { path: 'products', element: <ProductsPage /> },
      ]
    },
  ])


  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
