import { useSelector } from "react-redux";

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state) => state.auth
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isStudent: user?.role === "student",
    isInstructor: user?.role === "instructor",
    isAdmin: user?.role === "admin",
  };
};
