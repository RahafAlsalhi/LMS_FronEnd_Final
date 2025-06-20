import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { fetchCourses } from "../store/slices/courseSlice";
import Loading from "../components/common/Loading";

const Courses = () => {
  const dispatch = useDispatch();
  const { courses, isLoading, error } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <Container>
        <Typography color="error">Error loading courses: {error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Available Courses
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {course.description?.substring(0, 100)}...
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Instructor: {course.instructor_name}
                  </Typography>
                  {course.category_name && (
                    <Chip
                      label={course.category_name}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {course.price > 0 && (
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      ${course.price}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    component={Link}
                    to={`/courses/${course.id}`}
                    variant="contained"
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {courses.length === 0 && (
          <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
            No courses available
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Courses;
