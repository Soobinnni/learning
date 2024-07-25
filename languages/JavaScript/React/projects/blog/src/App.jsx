import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import RootLayout from './layouts/Root.jsx'
import MainLayout from './layouts/Main.jsx'
import ErrorPage from "./pages/Error/Error.jsx";
import ArticleListPage from './pages/Article/List.jsx'
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/http/index.js";
import ArticleDetailPage from "./pages/Article/Detail.jsx";
import NewArticle from "./components/feature/Article/NewArticle.jsx"
import EditArticle, { loader as editArticleLoader } from "./components/feature/Article/EditArticle.jsx"

const router = createBrowserRouter([
  {
    // default page layout
    id: 'root',
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      // Main Layout
      {
        path: '', // index는 children을 가질 수 없다.
        element: <MainLayout />,
        // loader: 토큰로더
        children: [
          {
            index: true,
            loader: () => redirect('/blog')
          },
          {
            path: 'blog',
            element: <ArticleListPage />,
            children: [
              {
                path: 'new',
                element: <NewArticle />,
              }
            ]
          },
          {
            path: 'blog/:blogId',
            element: <ArticleDetailPage />,
            children: [
              {
                path: 'edit',
                element: <EditArticle />,
                loader: editArticleLoader
              }
            ]
          }
        ]
      },
      /* OAuth Layout
      {
        path: '/accounts',
        element: ,
        errorElement: <ErrorPage />,
        children: [
          {
            path: 'login',
            element: 
          },
          {
            path: 'join',
            element:
          },
          {
            path: 'terms',
            element: 
          },
    
        ]
      } */
    ]
  }
]);
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
export default App;
