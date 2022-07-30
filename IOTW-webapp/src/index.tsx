// External modules
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OidcProvider } from "@axa-fr/react-oidc";
// Local modules
import Config from "./misc/config";
import Home from "./pages/Home";
import Uploads from "./pages/Uploads";
import Profile from "./pages/Profile";
import NavBar from "./components/NavBar";
import "bootstrap/dist/css/bootstrap.css";
import "./index.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const AppRoutes = () => {
  React.useEffect(() => {
    const preloader = document.getElementById("preloader") as HTMLElement;
    if(preloader) preloader.remove();
  }, []);
  return (
    <Routes>
      <Route path="/uploads" element={<Uploads/>} />
      <Route path="/my-uploads" element={<Uploads userOnly />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

root.render(
  <OidcProvider configuration={Config.sso}>
    <NavBar />
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </OidcProvider>
);

export default root;
