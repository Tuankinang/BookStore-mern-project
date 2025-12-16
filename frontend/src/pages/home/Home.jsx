import React from "react";
import Banner from "./Banner";
import TopSellers from "./TopSellers";
import Recommended from "./Recommended";
import News from "./News";
const Home = () => {
  return (
    <>
      <Banner />
      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        <TopSellers />
        <Recommended />
        <News />
      </div>
    </>
  );
};

export default Home;
