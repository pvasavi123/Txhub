import { Routes, Route } from "react-router-dom";
import WebsiteApp from "./website/App.jsx";
import StudentApp from "./student_admin/App.jsx";
import StudentRoute from "./website/components/StudentRoute";

function App() {
  const isStudentDomain = window.location.hostname.includes("student");

  // Redirect admin portal pages from the main website port to the Traineradmin app port (5174)
  if (window.location.pathname.startsWith("/admin")) {
    window.location.href = `http://localhost:5174${window.location.pathname}${window.location.search}`;
    return null;
  }

  // Auth pages on student domains should load the main WebsiteApp (where login/register/forgot-password reside)
  const isAuthPath = ["/login", "/register", "/forgot-password"].includes(window.location.pathname);

  if (isStudentDomain && !isAuthPath) {
    return (
      <Routes>
        <Route 
          path="/student/*" 
          element={
            <StudentRoute>
              <StudentApp />
            </StudentRoute>
          } 
        />
        <Route path="/*" element={<StudentApp />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route 
        path="/student/*" 
        element={
          <StudentRoute>
            <StudentApp />
          </StudentRoute>
        } 
      />
      <Route path="/*" element={<WebsiteApp />} />
    </Routes>
  );
}

export default App;
