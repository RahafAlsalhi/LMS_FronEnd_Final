/* eslint-disable no-unused-vars */
// frontend/src/pages/CourseDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Alert,
  Tab,
  Tabs,
} from "@mui/material";
import { PlayArrow, School, Person, Schedule } from "@mui/icons-material";
import { fetchCourseById } from "../store/slices/courseSlice";
import ModuleList from "../components/course/ModuleList";
import Loading from "../components/common/Loading";
import httpClient from "../services/httpClient";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCourse, isLoading, error } = useSelector(
    (state) => state.courses
  );
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [enrollmentId, setEnrollmentId] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchCourseById(id));
      if (isAuthenticated) {
        checkEnrollment();
      }
    }
  }, [dispatch, id, isAuthenticated]);

  const checkEnrollment = async () => {
    try {
      const response = await httpClient.get("/enrollments/my");
      const enrollment = response.find((e) => e.course_id === id);
      setEnrolled(!!enrollment);
      setEnrollmentId(enrollment?.id);
    } catch (error) {
      console.error("Error checking enrollment:", error);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setEnrolling(true);
    try {
      await httpClient.post("/enrollments", { course_id: id });
      setEnrolled(true);
      // Show success message or redirect
    } catch (error) {
      console.error("Error enrolling:", error);
      // Show error message
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLearning = () => {
    navigate(`/learn/${id}`);
  };

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <Container>
        <Alert severity="error">Error loading course: {error}</Alert>
      </Container>
    );
  }

  if (!currentCourse) {
    return (
      <Container>
        <Alert severity="warning">Course not found</Alert>
      </Container>
    );
  }

  const isInstructor = user?.role === "instructor" || user?.role === "admin";
  const isOwner = user?.id === currentCourse.instructor_id;

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Course Header */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h4" component="h1" gutterBottom>
                  {currentCourse.title}
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Chip
                    icon={<Person />}
                    label={currentCourse.instructor_name}
                    variant="outlined"
                  />
                  {currentCourse.category_name && (
                    <Chip
                      label={currentCourse.category_name}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {currentCourse.price > 0 && (
                    <Chip label={`$${currentCourse.price}`} color="success" />
                  )}
                </Box>

                <Typography variant="body1" paragraph>
                  {currentCourse.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Action Buttons */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  {!isAuthenticated && (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate("/login")}
                    >
                      Login to Enroll
                    </Button>
                  )}

                  {isAuthenticated && !enrolled && !isOwner && (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleEnroll}
                      disabled={enrolling}
                    >
                      {enrolling ? "Enrolling..." : "Enroll Now"}
                    </Button>
                  )}

                  {enrolled && (
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<PlayArrow />}
                      onClick={handleStartLearning}
                    >
                      Continue Learning
                    </Button>
                  )}

                  {isOwner && (
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate(`/instructor/courses/${id}/edit`)}
                    >
                      Edit Course
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Course Info
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <School color="action" />
                    <Typography variant="body2">
                      Instructor: {currentCourse.instructor_name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Schedule color="action" />
                    <Typography variant="body2">
                      Created:{" "}
                      {new Date(currentCourse.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>

                  {enrolled && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      ✅ You are enrolled in this course
                    </Alert>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Course Content Tabs */}
        <Box sx={{ mt: 4 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
          >
            <Tab label="Course Content" />
            <Tab label="Reviews" disabled />
            <Tab label="Announcements" disabled />
          </Tabs>

          <Box sx={{ mt: 3 }}>
            {tabValue === 0 && (
              <ModuleList courseId={id} isInstructor={isOwner} />
            )}
            {tabValue === 1 && (
              <Typography color="text.secondary">
                Reviews feature coming soon...
              </Typography>
            )}
            {tabValue === 2 && (
              <Typography color="text.secondary">
                Announcements feature coming soon...
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default CourseDetail;
