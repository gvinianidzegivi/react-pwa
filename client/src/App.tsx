import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router";
import { Create } from "./pages/Create";
import { Tasks } from "./pages/Tasks";
import { Welcome } from "./pages/Welcome";
import './App.css';

export const App = () => {
  return (
    <BrowserRouter>
      <Content />
    </BrowserRouter>
  );
};

const Content = () => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="fadeIn">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/create" element={<Create />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};
