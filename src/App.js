/*global chrome*/
import "./App.css";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Home from "../components/Home";
import MyBookmarks from "../components/MyBookmarks";
import LanterPlus from "../components/LanterPlus";
import Footer from "../components/Footer";
function App() {
  const [currentPage, setCurrentPage] = useState("Home");

  return (
    <div className="container">
      <Navbar setCurrentPage={setCurrentPage} currentPage={currentPage} />
      <div className="main">
        {currentPage === "Home" && <Home />}
        {/* {currentPage === "MyBookmarks" && <MyBookmarks />}
        {currentPage === "LanterPlus" && <LanterPlus />} */}
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
