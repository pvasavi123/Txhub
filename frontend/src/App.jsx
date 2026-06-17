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

  return (
    <Routes>
      {/* 1.5. Always prioritize the explicit /student/ path */}
      <Route 
        path="/student/*" 
        element={
          <StudentRoute>
            <StudentApp />
          </StudentRoute>
        } 
      />

      {/* 2. Explicitly allow auth pages to reach the website app (even on student domains) */}
      <Route path="/login" element={<WebsiteApp />} />
      <Route path="/register" element={<WebsiteApp />} />

      {/* 3. If it's a specific subdomain, treat the home path as that dashboard */}
      {isStudentDomain && <Route path="/*" element={<StudentApp />} />}

      {/* 4. Default fallback to the main Website application */}
      <Route path="/*" element={<WebsiteApp />} />
    </Routes>
  );
}

export default App;
