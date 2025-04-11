import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import './App.css'
function App() {
  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black">
      <Navbar />
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

// import React from 'react'
// import Footer from "./components/Footer";
// function App() {
//   return (
//     <>
//       <Navbar />
      
//       <Footer />
     
      
//     </>
//   )
// }

// export default App