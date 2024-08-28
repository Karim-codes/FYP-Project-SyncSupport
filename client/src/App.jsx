import * as React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import About from "./pages/AboutUs/AboutUs";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Welcome from "./pages/Welcome/Welcome";
import Chatbot from "./components/Chatbot";
import "./App.css";

// Check if the user is authenticated based on token presence
const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

const Layout = () => {
  return (
    <div className="layout">
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

// Redirect to home if authenticated, else to login page
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // Check authentication for the root path and redirect accordingly
      {
        path: "/",
        element: isAuthenticated() ? <Navigate to="/home" /> : <Welcome />,
      },
      { path: "/home", element: <ProtectedRoute element={<Home />} /> },
      { path: "/about-us", element: <About /> },
      { path: "/chatbot", element: <ProtectedRoute element={<Chatbot />} /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> }
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
