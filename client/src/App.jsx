// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/Page'; // Adjust path
import { Provider } from 'jotai';
import Signin from './pages/signin/Signin';
import Register from './pages/register/Register';
import Header from './componets/Header/Header';
import PrivateRoute from './routes/PrivateRoute';
import ScheduleTime from './pages/ScheduleTime/ScheduleTime';
import RoomPage from './pages/rooms/RoomPage/RoomPage';
import EventListHome from './pages/EventsList/EventListHome';

const App = () => {
  return (
    <Provider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<PrivateRoute><MainPage /></PrivateRoute>} />
          <Route path="/room/:roomId" element={<PrivateRoute><RoomPage /></PrivateRoute>} />
          <Route path="/:room/createSchedule" element={<PrivateRoute><ScheduleTime /></PrivateRoute>} />
          <Route path='/eventsList' element={<PrivateRoute><EventListHome/></PrivateRoute>}/>
          <Route path="/signin" element={<Signin />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;