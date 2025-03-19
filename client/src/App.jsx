// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/Page'; // Adjust path
import { Provider } from 'jotai';
import Signin from './pages/signin/Signin';
import Register from './pages/register/Register';
import Header from './componets/Header/Header';
import PrivateRoute from './routes/PrivateRoute';
import Room1Page from './pages/rooms/Room1Page/Room1Page';
import Room2Page from './pages/rooms/Room2Page/Room2Page';
import Room3Page from './pages/rooms/Room3Page/Room3Page';
import ScheduleTime from './pages/ScheduleTime/ScheduleTime';
import RoomPage from './pages/rooms/RoomPage/RoomPage';

const App = () => {
  return (
    <Provider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<PrivateRoute><MainPage /></PrivateRoute>} />
          <Route path="/room/:roomId" element={<PrivateRoute><RoomPage /></PrivateRoute>} />
          <Route path="/:room/createSchedule" element={<PrivateRoute><ScheduleTime /></PrivateRoute>} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;