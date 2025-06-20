// frontend/src/components/course/CoursePlayer.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Paper,
  Button,
  LinearProgress,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";
import {
  PlayArrow,
  Description,
  Quiz,
  Assignment,
  CheckCircle,
  RadioButtonUnchecked,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import httpClient from "../../services/httpClient";

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const courseResponse = await httpClient.get(`/courses/${courseId}`);
      setCourse(courseResponse);

      // Fetch modules and lessons
      const modulesResponse = await httpClient.get(
        `/modules/course/${courseId}`
      );

      // Fetch lessons for each module
      const modulesWithLessons = await Promise.all(
        modulesResponse.map(async (module) => {
          const moduleDetail = await httpClient.get(`/modules/${module.id}`);
          return moduleDetail;
        })
      );

      setModules(modulesWithLessons);

      // Set first lesson as current if available
      if (
        modulesWithLessons.length > 0 &&
        modulesWithLessons[0].lessons?.length > 0
      ) {
        setCurrentLesson(modulesWithLessons[0].lessons[0]);
      }

      // Calculate progress
      const totalLessons = modulesWithLessons.reduce(
        (acc, module) => acc + (module.lessons?.length || 0),
        0
      );
      const completedCount = 0; // TODO: Fetch from API
      setProgress(totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0);
    } catch (error) {
      console.error("Error fetching course data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
  };

  const handleMarkComplete = async (lessonId) => {
    try {
      await httpClient.post(`/lessons/${lessonId}/complete`);
      setCompletedLessons((prev) => new Set([...prev, lessonId]));

      // Recalculate progress
      const totalLessons = modules.reduce(
        (acc, module) => acc + (module.lessons?.length || 0),
        0
      );
      const newCompletedCount = completedLessons.size + 1;
      setProgress(
        totalLessons > 0 ? (newCompletedCount / totalLessons) * 100 : 0
      );
    } catch (error) {
      console.error("Error marking lesson complete:", error);
    }
  };

  const getNextLesson = () => {
    if (!currentLesson) return null;

    let found = false;
    for (const module of modules) {
      for (const lesson of module.lessons || []) {
        if (found) return lesson;
        if (lesson.id === currentLesson.id) found = true;
      }
    }
    return null;
  };

  const getPreviousLesson = () => {
    if (!currentLesson) return null;

    let previous = null;
    for (const module of modules) {
      for (const lesson of module.lessons || []) {
        if (lesson.id === currentLesson.id) return previous;
        previous = lesson;
      }
    }
    return null;
  };

  const getContentIcon = (contentType) => {
    switch (contentType) {
      case "video":
        return <PlayArrow color="primary" />;
      case "text":
        return <Description color="action" />;
      case "quiz":
        return <Quiz color="secondary" />;
      case "assignment":
        return <Assignment color="warning" />;
      default:
        return <Description color="action" />;
    }
  };

  const renderLessonContent = (lesson) => {
    if (!lesson) {
      return (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Select a lesson to start learning
          </Typography>
        </Box>
      );
    }

    switch (lesson.content_type) {
      case "video":
        return (
          <Box>
            {lesson.content_url ? (
              <Box sx={{ mb: 3 }}>
                {lesson.content_url.includes("youtube.com") ||
                lesson.content_url.includes("youtu.be") ? (
                  <iframe
                    width="100%"
                    height="400"
                    src={lesson.content_url.replace("watch?v=", "embed/")}
                    frameBorder="0"
                    allowFullScreen
                    style={{ borderRadius: 8 }}
                  />
                ) : (
                  <video
                    width="100%"
                    height="400"
                    controls
                    style={{ borderRadius: 8 }}
                  >
                    <source src={lesson.content_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  bgcolor: "grey.100",
                  borderRadius: 1,
                  mb: 3,
                }}
              >
                <PlayArrow sx={{ fontSize: 48, color: "grey.400", mb: 1 }} />
                <Typography color="text.secondary">
                  Video content will be available soon
                </Typography>
              </Box>
            )}
            {lesson.content_text && (
              <Typography variant="body1" paragraph>
                {lesson.content_text}
              </Typography>
            )}
          </Box>
        );

      case "text":
        return (
          <Box>
            <Typography
              variant="body1"
              sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
            >
              {lesson.content_text || "Content will be available soon."}
            </Typography>
          </Box>
        );

      case "quiz":
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Quiz sx={{ fontSize: 48, color: "secondary.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Quiz: {lesson.title}
            </Typography>
            <Typography color="text.secondary" paragraph>
              This lesson contains a quiz to test your understanding.
            </Typography>
            <Button variant="contained" color="secondary">
              Start Quiz
            </Button>
          </Box>
        );

      case "assignment":
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Assignment sx={{ fontSize: 48, color: "warning.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Assignment: {lesson.title}
            </Typography>
            <Typography color="text.secondary" paragraph>
              {lesson.content_text ||
                "Complete this assignment to demonstrate your skills."}
            </Typography>
            {lesson.content_url && (
              <Button
                variant="outlined"
                href={lesson.content_url}
                target="_blank"
                sx={{ mr: 2 }}
              >
                View Instructions
              </Button>
            )}
            <Button variant="contained" color="warning">
              Submit Assignment
            </Button>
          </Box>
        );

      default:
        return (
          <Typography variant="body1">
            {lesson.content_text || "Content will be available soon."}
          </Typography>
        );
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading course...</Typography>
      </Box>
    );
  }

  const nextLesson = getNextLesson();
  const previousLesson = getPreviousLesson();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={() => navigate(`/courses/${courseId}`)}>
            <ArrowBack />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">{course?.title}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
              />
              <Typography variant="body2" color="text.secondary">
                {Math.round(progress)}% Complete
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={2} sx={{ px: 2 }}>
        {/* Sidebar - Course Content */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "calc(100vh - 160px)", overflow: "auto" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Course Content
              </Typography>

              {modules.map((module) => (
                <Box key={module.id} sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    {module.title}
                  </Typography>
                  <List dense>
                    {module.lessons?.map((lesson) => (
                      <ListItem key={lesson.id} disablePadding>
                        <ListItemButton
                          selected={currentLesson?.id === lesson.id}
                          onClick={() => handleLessonSelect(lesson)}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {completedLessons.has(lesson.id) ? (
                              <CheckCircle color="success" />
                            ) : (
                              getContentIcon(lesson.content_type)
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={lesson.title}
                            secondary={`${lesson.duration} min`}
                            primaryTypographyProps={{
                              variant: "body2",
                              sx: {
                                textDecoration: completedLessons.has(lesson.id)
                                  ? "line-through"
                                  : "none",
                              },
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                  <Divider sx={{ my: 1 }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content Area */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              height: "calc(100vh - 160px)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {currentLesson && (
              <CardContent sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {getContentIcon(currentLesson.content_type)}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5">{currentLesson.title}</Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Chip label={currentLesson.content_type} size="small" />
                      <Chip
                        label={`${currentLesson.duration} min`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  {!completedLessons.has(currentLesson.id) && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleMarkComplete(currentLesson.id)}
                    >
                      Mark Complete
                    </Button>
                  )}
                </Box>
              </CardContent>
            )}

            <CardContent sx={{ flexGrow: 1, overflow: "auto" }}>
              {renderLessonContent(currentLesson)}
            </CardContent>

            {/* Navigation Footer */}
            {currentLesson && (
              <CardContent sx={{ borderTop: 1, borderColor: "divider", py: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Button
                    startIcon={<ArrowBack />}
                    onClick={() =>
                      previousLesson && handleLessonSelect(previousLesson)
                    }
                    disabled={!previousLesson}
                  >
                    Previous
                  </Button>

                  <Typography variant="body2" color="text.secondary">
                    {currentLesson.title}
                  </Typography>

                  <Button
                    endIcon={<ArrowForward />}
                    onClick={() => nextLesson && handleLessonSelect(nextLesson)}
                    disabled={!nextLesson}
                    variant={
                      !completedLessons.has(currentLesson.id)
                        ? "outlined"
                        : "contained"
                    }
                  >
                    Next
                  </Button>
                </Box>
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CoursePlayer;
