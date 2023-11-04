import {FC, lazy} from 'react';
import './styles/App.scss';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import RequireAuth from './hoc/RequireAuth';


// import Register from './pages/register/Register';
// import Login from './pages/login/Login';
// import Home from './pages/home/Home';
// import Profile from './pages/profile/Profile';

const Register = lazy(() => import('./pages/register/Register'));
const Login = lazy(() => import('./pages/login/Login'));
const Home = lazy(() => import('./pages/home/Home'));
const Profile = lazy(() => import('./pages/profile/Profile'));






const App: FC = () => {
  
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }/>
            <Route path="profile/:id" element={
              <RequireAuth >
                <Profile />
              </RequireAuth >
            }/>
          </Route>
          <Route path="login" element={<Login />}/>
          <Route path="register" element={<Register />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
