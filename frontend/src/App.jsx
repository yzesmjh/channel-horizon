import { Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ErrorPage from './Pages/ErrorPage';
import Login from './Pages/Login';
import Logout from './Pages/Logout';
import Transaction from './Pages/Transaction';
import MyDashboard from './Pages/MyDashboard';
import ViewUsers from './Pages/ViewUsers';
import ViewSingleUsers from './Pages/ViewSingleUsers';
import Profile from './Pages/Profile';
import Notification from './Pages/Notification';
import Home from './Components/Home';
import MyProduct from './Pages/MyProduct';
import ChatBot from './Components/ChatBot';
import ServerLoader from './Components/ServerLoader';
import useServerPing from './Hooks/useServerPing';

const isAuthenticated = () => {
  // You can extend this to check the JWT token or session expiration if needed
  return sessionStorage.getItem("user") !== null;
};

const ProtectedRoutes = ({ children }) => {
  if (isAuthenticated()) {
    return children;
  } else {
    return <Navigate to="/" replace={true} />;
  }
};

ProtectedRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};

const App = () => {
  const { ready } = useServerPing();

  return (
    <>
    {/* Full-screen loading overlay — visible until backend responds */}
    <ServerLoader visible={!ready} />

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" replace={true} /> : <Login />} />
      <Route path="/logout" element={<Logout />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoutes>
          <MyDashboard/>
        </ProtectedRoutes>
      } />
      <Route path="/profile" element={
        <ProtectedRoutes>
          <Profile/>
        </ProtectedRoutes>
      } />
      <Route path="/notification" element={
        <ProtectedRoutes>
          <Notification/>
        </ProtectedRoutes>
      } />
      <Route path="/users" element={
        <ProtectedRoutes>
          <ViewUsers/>
        </ProtectedRoutes>
      } />
      <Route path="/users/:id" element={
        <ProtectedRoutes>
          <ViewSingleUsers/>
        </ProtectedRoutes>
      } />
      <Route path="/mytransactions" element={
        <ProtectedRoutes>
          <Transaction />
        </ProtectedRoutes>
      } />
      <Route path="/products" element={
        <ProtectedRoutes>
          <MyProduct />
        </ProtectedRoutes>
      } />
      
      {/* Error Page */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>

    {/* Floating chatbot — visible on every page */}
    <ChatBot />
    </>
  );
};

export default App;
