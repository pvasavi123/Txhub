import { Routes, Route } from "react-router-dom";
import WebsiteApp from "./website/App.jsx";
import StudentApp from "./student_admin/App.jsx";
import StudentRoute from "./website/components/StudentRoute";

function App() {
  const isStudentDomain = window.location.hostname.includes("student");

  // Redirect admin portal pages from the main website port to the Traineradmin app port (5174) only if user is admin
  if (window.location.pathname.startsWith("/admin")) {
    const userString = localStorage.getItem("user");
    let user = null;
    try {
      user = userString ? JSON.parse(userString) : null;
    } catch (e) {}

    if (user && user.isAdmin) {
      window.location.href = `http://localhost:5174${window.location.pathname}${window.location.search}`;
      return null;
    } else {
      // If they are not admin, stay on the same portal by sending them back to home
      window.location.href = "/";
      return null;
    }
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
