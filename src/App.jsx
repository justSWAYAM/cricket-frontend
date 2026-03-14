import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import GridPage from "./pages/GridPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminFeedbackPage from "./pages/AdminFeedbackPage";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/grid" element={<GridPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}