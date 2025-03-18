import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Page from './pages/Page'
import { Provider } from 'jotai';
import Signin from './pages/signin/Signin'
import Register from './pages/register/Register'
import Header from './componets/Header/Header';
import PrivateRoute from './routes/PrivateRoute';


const App = () => {
  return (
    <Provider>
      <Router>
        <Header />
        <Routes>
        <Route path="/" element={<PrivateRoute><Page /></PrivateRoute>} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;