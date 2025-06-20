import { useSelector } from "react-redux";
import { Typography, Box } from "@mui/material";
import StudentDashboard from "../components/dashboard/StudentDashboard";
import InstructorDashboard from "../components/dashboard/InstructorDashboard";
import AdminDashboard from "../components/dashboard/AdminDashboard";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const renderDashboard = () => {
    switch (user?.role) {
      case "student":
        return <StudentDashboard />;
      case "instructor":
        return <InstructorDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return (
          <Typography variant="h6" color="error">
            Invalid user role
          </Typography>
        );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: "85px", // space for fixed header if needed
        px: 2,
        width: "100%",
      }}
    >
      {renderDashboard()}
    </Box>
  );
};

export default Dashboard;
