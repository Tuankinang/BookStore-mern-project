import React from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvide } from "./context/AuthContext";

function App() {
  return (
    <>
      <AuthProvide>
        <Navbar />
        <main className="flex-grow max-w-screen-2xl mx-auto px-4 py-6 font-primary w-full bg-white">
          <Outlet />
        </main>
        <Footer />
      </AuthProvide>
    </>
  );
}

export default App;
