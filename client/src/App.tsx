import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Donator from "./pages/Donator";
import NgoNewCampaign from "./pages/NgoNewCampaign";
import Layout from "./pages/Layout";

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donator" element={<Donator />} />
        <Route path="/ngo/new" element={<NgoNewCampaign />} />
      </Routes>
    </Layout>
  );
};

export default App;
