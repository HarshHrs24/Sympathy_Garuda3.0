
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home'
import Authenticate from './pages/Authenticate/Authenticate';
import Activate from './pages/Activate/Activate';
import Rooms from './pages/Rooms/Rooms';
import Room from './pages/Room/Room';
import ArticleDetail from './pages/Articles/ArticleDetail';
import ArticleList from './pages/Articles/ArticleList';
import Navigation from './components/shared/Navigation/Navigation'
import { useSelector } from 'react-redux';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';
import Loader from './components/shared/Loader/Loader';

function App() {
  const { loading } = useLoadingWithRefresh();
  return loading ? (
    <Loader message="Loading, please wait.." />
    // 'loading'
  ) : (

    <>
      <BrowserRouter>
        <Navigation />
        <Routes>
          {/* <Route  path="/" exact element={<Home/>} /> */}

          <Route
            path="/"
            element={
              <GuestRoute>
                <Home />
              </GuestRoute>
            }
          />
          <Route
            path="/authenticate"
            element={
              <GuestRoute>
                <Authenticate />
              </GuestRoute>
            }
          />
          <Route
            path="/activate"
            element={
              <SemiProtectedRoute>
                <Activate />
              </SemiProtectedRoute>
            }
          />
          <Route
            path="/rooms"
            element={
              <ProtectedRoute>
                <Rooms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/article"
            element={
              <ProtectedRoute>
                <ArticleList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/article/:id"
            element={
              <ProtectedRoute>
                <ArticleDetail />
              </ProtectedRoute>
            }
          />
          <Route
          path="/room/:id"
          element={
            <ProtectedRoute >
                    <Room />
                </ProtectedRoute>
          }
        />

        </Routes>
      </BrowserRouter>
    </>
  );
}


function GuestRoute({ children }) {
  const { isAuth } = useSelector((state) => state.auth);
  return isAuth ? <Navigate to='/rooms' /> : children;
};
function SemiProtectedRoute({ children }) {
  const { user, isAuth } = useSelector((state) => state.auth);
  return !isAuth ? <Navigate to='/' /> : isAuth && !user.activated ? children : <Navigate to='/rooms' />;
};

function ProtectedRoute({ children }) {
  const { user, isAuth } = useSelector((state) => state.auth);
  return !isAuth ? <Navigate to='/' /> : isAuth && !user.activated ? <Navigate to='/activate' /> : children;
}





export default App;