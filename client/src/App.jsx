import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Items from './pages/Items';
import PostItem from './pages/PostItem';
import ItemDetail from './pages/ItemDetail'; // Import ItemDetail component
import PrivateRouteWrapper from './components/PrivateRouteWrapper'; // Import PrivateRouteWrapper

function App() {
  return (
    <Router>
      <div className="App bg-white h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/items" 
              element={
                <PrivateRouteWrapper>
                  <Items />
                </PrivateRouteWrapper>
              } 
            />
            <Route 
              path="/post-item" 
              element={
                <PrivateRouteWrapper>
                  <PostItem />
                </PrivateRouteWrapper>
              } 
            />
            {/* Route for Item Detail Page */}
            <Route path="/items/:id" element={<ItemDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
