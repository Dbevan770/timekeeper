import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import ErrorPage from "./scenes/ErrorPage/ErrorPage.tsx";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Register from "./scenes/Register/Register.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "register",
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>
);
