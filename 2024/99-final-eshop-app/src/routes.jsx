import { createBrowserRouter } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ShoppingCart from "./pages/ShoppingCart";
import Layout from "./layout/layout";

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/products',
        element: <Products />
      },
      {
        path: '/cart',
        element: <ShoppingCart />
      }
    ]
  },
]);

export default routes;