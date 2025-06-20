// frontend/src/App.jsx
import React, { useEffect } from "react";
import "./index.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, CircularProgress, Typography } from "@mui/material";
import { store } from "./store/store";
import { getCurrentUser } from "./store/slices/authSlice";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Header from "./components/common/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CoursePlayer from "./components/course/CoursePlayer";
import CategoryManagement from "./pages/admin/CategoryManagement";
import CreateCourse from "./pages/instructor/CreateCourse";
import CourseManagement from "./pages/instructor/CourseManagement";
import ForgotPassword from "./pages/ForgotPassword";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import UserManagement from "./pages/admin/UserManagement";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Auth wrapper component
const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { token, isLoading, user, error } = useSelector((state) => state.auth);
  const [hasAttemptedAuth, setHasAttemptedAuth] = React.useState(false);

  useEffect(() => {
    // Only attempt to fetch user if we have a token and haven't tried yet
    if (token && !user && !hasAttemptedAuth && !error) {
      console.log("Attempting to fetch current user...");
      setHasAttemptedAuth(true);
      dispatch(getCurrentUser());
    } else if (!token) {
      // No token, mark as attempted
      setHasAttemptedAuth(true);
    }
  }, [dispatch, token, user, hasAttemptedAuth, error]);

  // Show loading only if we have a token, no user, and are still loading
  if (token && !user && isLoading && !error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>Restoring your session...</Typography>
      </Box>
    );
  }

  // If there was an error or we have no token, just render the app
  return children;
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthWrapper>
            <div className="App">
              <Header />
              <main style={{ minHeight: "90vh" }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:id" element={<CourseDetail />} />
                  <Route
                    path="/learn/:courseId"
                    element={
                      <ProtectedRoute>
                        <CoursePlayer />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-course"
                    element={
                      <ProtectedRoute requiredRole="instructor">
                        <CreateCourse />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/categories"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <CategoryManagement />
                      </ProtectedRoute>
                    }
                  />{" "}
                  <Route path="/admin/users" element={<UserManagement />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  {/* Your existing routes */}
                  <Route path="/create-course" element={<CreateCourse />} />
                  {/* New route for course management */}
                  <Route
                    path="/course/:courseId/manage"
                    element={<CourseManagement />}
                  />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                </Routes>
              </main>
            </div>
          </AuthWrapper>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
