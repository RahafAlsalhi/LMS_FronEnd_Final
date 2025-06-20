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

import CategoryManagement from "./pages/admin/CategoryManagement";
import CreateCourse from "./pages/instructor/CreateCourse";

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
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
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
