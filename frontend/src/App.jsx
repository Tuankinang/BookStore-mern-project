import React from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <main className="flex-grow py-6 font-primary w-full bg-white">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
