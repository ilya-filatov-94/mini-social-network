import {FC, lazy} from 'react';
import './styles/App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import RequireAuth from './hoc/RequireAuth';

import Register from './pages/register/Register';
import Login from './pages/login/Login';
const Home = lazy(() => import('./pages/home/Home'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const EditProfile = lazy(() => import('./pages/editProfile/EditProfile'));
const Friends = lazy(() => import('./pages/friends/Friends'));
const Users = lazy(() => import('./pages/users/Users'));
const Messenger = lazy(() => import('./pages/messenger/Messenger'));


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
            <Route path="profile/:ref/edit" element={
              <RequireAuth >
                <EditProfile />
              </RequireAuth >
            }/>
            <Route path="friends" element={
              <RequireAuth >
                <Friends />
              </RequireAuth >
            }/>
            <Route path="users" element={
              <RequireAuth >
                <Users />
              </RequireAuth >
            }/>
            <Route path="messages" element={
              <RequireAuth >
                <Messenger />
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
