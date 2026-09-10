import { useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import { Create } from "./pages/Create";
import { Tasks } from "./pages/Tasks";
import { Welcome } from "./pages/Welcome";

export const App = () => {
  return (
    <BrowserRouter>
      <Content />
    </BrowserRouter>
  );
}

const Content = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransistionStage] = useState("fadeIn");


  if (location !== displayLocation) setTransistionStage("fadeOut");

  return (
    <div
      className={transitionStage}
      onAnimationEnd={() => {
        if (transitionStage === "fadeOut") {
          setDisplayLocation(location);
          setTransistionStage("fadeIn");
        }
      }}
    >
      <Routes location={displayLocation}>
        <Route path="/" element={<Welcome />} />
        <Route path="/create" element={<Create />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </div>
  );
};
