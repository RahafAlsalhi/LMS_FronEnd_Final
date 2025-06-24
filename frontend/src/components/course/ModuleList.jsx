
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  ExpandMore,
  Add,
  Edit,
  Delete,
  PlayArrow,
  Description,
  Quiz,
  Assignment,
  CheckCircle,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import httpClient from "../../services/httpClient";

const ModuleList = ({ courseId, isInstructor = false }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newModule, setNewModule] = useState({ title: "", description: "" });
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  const fetchModules = async () => {
    try {
      const response = await httpClient.get(`/modules/course/${courseId}`);
      setModules(response);
    } catch (error) {
      console.error("Error fetching modules:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModule = async () => {
    try {
      await httpClient.post("/modules", {
        course_id: courseId,
        ...newModule,
      });
      setCreateDialogOpen(false);
      setNewModule({ title: "", description: "" });
      fetchModules();
    } catch (error) {
      console.error("Error creating module:", error);
    }
  };

  const getContentIcon = (contentType) => {
    switch (contentType) {
      case "video":
        return <PlayArrow />;
      case "text":
        return <Description />;
      case "quiz":
        return <Quiz />;
      case "assignment":
        return <Assignment />;
      default:
        return <Description />;
    }
  };

  if (loading) {
    return <Typography>Loading modules...</Typography>;
  }

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" component="h2">
          Course Content
        </Typography>
        {isInstructor && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Add Module
          </Button>
        )}
      </Box>

      {/* Modules List */}
      {modules.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" gutterBottom>
              No modules yet
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {isInstructor
                ? "Start building your course by adding modules and lessons."
                : "This course content is being prepared."}
            </Typography>
            {isInstructor && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setCreateDialogOpen(true)}
                sx={{ mt: 2 }}
              >
                Add First Module
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        modules.map((module, index) => (
          <Accordion key={module.id} defaultExpanded={index === 0}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{module.title}</Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Chip
                    label={`${module.lesson_count} lessons`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`${module.total_duration} min`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
              {isInstructor && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                    <Delete />
                  </IconButton>
                </Box>
              )}
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ width: "100%" }}>
                {module.description && (
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {module.description}
                  </Typography>
                )}

                <LessonList moduleId={module.id} isInstructor={isInstructor} />
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      )}

      {/* Create Module Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Module</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Module Title"
            value={newModule.title}
            onChange={(e) =>
              setNewModule({ ...newModule, title: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={newModule.description}
            onChange={(e) =>
              setNewModule({ ...newModule, description: e.target.value })
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateModule}
            variant="contained"
            disabled={!newModule.title}
          >
            Create Module
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Lesson List Component
const LessonList = ({ moduleId, isInstructor }) => {
  const [lessons, setLessons] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: "",
    content_type: "text",
    content_text: "",
    content_url: "",
    duration: 0,
  });

  useEffect(() => {
    fetchLessons();
  }, [moduleId]);

  const fetchLessons = async () => {
    try {
      const response = await httpClient.get(`/modules/${moduleId}`);
      setLessons(response.lessons || []);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = async () => {
    try {
      const payload = {
        module_id: moduleId,
        ...newLesson,
      };

      // Add this logging to see what's being sent
      console.log("Sending lesson payload:", payload);

      await httpClient.post("api/lessons", payload);
      console.log("Lesson created successfully", moduleId);
      setCreateDialogOpen(false);
      setNewLesson({
        title: "",
        content_type: "text",
        content_text: "",
        content_url: "",
        duration: 0,
      });
      fetchLessons();
    } catch (error) {
      console.error("Error creating lesson:", error);
      console.error("Error response:", error.response?.data); // Add this line
    }
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

  return (
    <Box>
      {/* Lessons List */}
      <List>
        {lessons.map((lesson) => (
          <ListItem key={lesson.id} sx={{ pl: 0 }}>
            <ListItemIcon>{getContentIcon(lesson.content_type)}</ListItemIcon>
            <ListItemText
              primary={lesson.title}
              secondary={`${lesson.content_type} • ${lesson.duration} min`}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {!isInstructor && (
                <IconButton size="small">
                  <RadioButtonUnchecked />
                </IconButton>
              )}
              {isInstructor && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                  <IconButton size="small">
                    <Delete />
                  </IconButton>
                </Box>
              )}
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Add Lesson Button */}
      {isInstructor && (
        <Button
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ mt: 1 }}
        >
          Add Lesson
        </Button>
      )}

      {/* Create Lesson Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Lesson</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Lesson Title"
            value={newLesson.title}
            onChange={(e) =>
              setNewLesson({ ...newLesson, title: e.target.value })
            }
            margin="normal"
          />
          <TextField
            select
            fullWidth
            label="Content Type"
            value={newLesson.content_type}
            onChange={(e) =>
              setNewLesson({ ...newLesson, content_type: e.target.value })
            }
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value="text">Text Content</option>
            <option value="video">Video</option>
            <option value="quiz">Quiz</option>
            <option value="assignment">Assignment</option>
          </TextField>

          {newLesson.content_type === "text" && (
            <TextField
              fullWidth
              label="Content"
              multiline
              rows={6}
              value={newLesson.content_text}
              onChange={(e) =>
                setNewLesson({ ...newLesson, content_text: e.target.value })
              }
              margin="normal"
            />
          )}

          {(newLesson.content_type === "video" ||
            newLesson.content_type === "assignment") && (
            <TextField
              fullWidth
              label="Content URL"
              value={newLesson.content_url}
              onChange={(e) =>
                setNewLesson({ ...newLesson, content_url: e.target.value })
              }
              margin="normal"
              helperText="URL to video, file, or external resource"
            />
          )}

          <TextField
            fullWidth
            label="Duration (minutes)"
            type="number"
            value={newLesson.duration}
            onChange={(e) =>
              setNewLesson({
                ...newLesson,
                duration: parseInt(e.target.value) || 0,
              })
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateLesson}
            variant="contained"
            disabled={!newLesson.title}
          >
            Create Lesson
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModuleList;
