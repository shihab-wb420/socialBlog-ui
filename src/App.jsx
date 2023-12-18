import { useState } from 'react'; 
import {Toaster} from "react-hot-toast";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './styles/App.css';
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messenger from "./pages/Messenger";



function App() {
  

  return (
    <Router>
      <Navbar/>
      <div className="App">  
       <Routes>
        <Route exact path="/" element={<Feed />}/>
        <Route path="/messenger" element={<Messenger />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/login" element={<Login />}/>
       </Routes>
       <Toaster/>
      </div>
    </Router>
  )
}

export default App
