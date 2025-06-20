import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import httpClient from "../../services/httpClient";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [enrollments, setEnrollments] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgress: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching student data for user:", user?.id);

      // Fetch student enrollments
      let studentEnrollments = [];
      try {
        const enrollmentsResponse = await httpClient.get("/enrollments/my");
        studentEnrollments = enrollmentsResponse || [];
        console.log("Student enrollments:", studentEnrollments);
      } catch (enrollmentError) {
        console.log("No enrollments found:", enrollmentError.message);
        // User hasn't enrolled in any courses yet
      }

      // Fetch available courses - using published endpoint (approved courses)
      const coursesResponse = await httpClient.get("/courses/published");
      console.log("Published courses:", coursesResponse);

      // Filter out courses the student is already enrolled in
      const enrolledCourseIds = studentEnrollments.map((e) => e.course_id);
      const filteredCourses = (coursesResponse || []).filter(
        (course) => !enrolledCourseIds.includes(course.id)
      );
      console.log("Available courses (not enrolled):", filteredCourses);

      setEnrollments(studentEnrollments);
      setAvailableCourses(filteredCourses.slice(0, 6)); // Show first 6 courses

      // Calculate stats based on actual enrollments
      const completed = studentEnrollments.filter(
        (e) => e.progress >= 100 || e.completed_at
      ).length;
      const inProgress = studentEnrollments.filter(
        (e) =>
          (!e.completed_at && e.progress > 0 && e.progress < 100) ||
          (!e.completed_at && !e.progress) // Enrolled but not completed
      ).length;

      setStats({
        totalCourses: studentEnrollments.length,
        completedCourses: completed,
        inProgress: inProgress,
      });
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Failed to load dashboard data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollInCourse = async (courseId) => {
    try {
      console.log("Enrolling in course:", courseId);

      // Use your existing enrollments endpoint
      await httpClient.post("/enrollments", {
        course_id: courseId,
      });

      alert("✅ Successfully enrolled in course!");

      // Refresh data
      await fetchStudentData();
    } catch (error) {
      console.error("Error enrolling in course:", error);
      alert("❌ Error enrolling in course: " + error.message);
    }
  };

  const handleContinueLearning = (courseId) => {
    // Navigate to course learning page
    navigate(`/learn/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 text-lg">Loading your courses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="text-red-800">{error}</p>
              </div>
              <button
                onClick={fetchStudentData}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-slate-600">Continue your learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Enrolled Courses */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-slate-800">
                {stats.totalCourses}
              </span>
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">
              Enrolled Courses
            </h3>
            <p className="text-sm text-slate-500">
              Total courses you're taking
            </p>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-slate-800">
                {stats.completedCourses}
              </span>
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">Completed</h3>
            <p className="text-sm text-slate-500">Courses you've finished</p>
          </div>

          {/* In Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-slate-800">
                {stats.inProgress}
              </span>
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">In Progress</h3>
            <p className="text-sm text-slate-500">Currently learning</p>
          </div>

          {/* Available */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-slate-800">
                {availableCourses.length}
              </span>
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">Available</h3>
            <p className="text-sm text-slate-500">New courses to explore</p>
          </div>
        </div>

        {/* My Enrolled Courses */}
        {enrollments.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">My Courses</h2>
              <button
                onClick={() => navigate("/my-courses")}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
              >
                View All
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        {enrollment.title}
                      </h3>
                      <p className="text-sm text-slate-600 mb-1">
                        <span className="font-medium">Instructor:</span>{" "}
                        {enrollment.instructor_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Enrolled:{" "}
                        {new Date(enrollment.enrolled_at).toLocaleDateString()}
                      </p>
                    </div>
                    {(enrollment.completed_at ||
                      (enrollment.progress && enrollment.progress >= 100)) && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Completed
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">
                        Progress
                      </span>
                      <span className="text-sm text-slate-600">
                        {enrollment.progress || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleContinueLearning(enrollment.course_id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {enrollment.progress && enrollment.progress > 0
                      ? "Continue Learning"
                      : "Start Course"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Courses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              {enrollments.length > 0
                ? "Discover More Courses"
                : "Available Courses"}
            </h2>
            {availableCourses.length > 6 && (
              <button
                onClick={() => navigate("/courses")}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
              >
                View All
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>

          {availableCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-200 group"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-1">
                      <span className="font-medium">Instructor:</span>{" "}
                      {course.instructor_name}
                    </p>
                    <p className="text-sm text-slate-600 mb-3">
                      <span className="font-medium">Category:</span>{" "}
                      {course.category_name}
                    </p>

                    {/* Price */}
                    <div className="mb-4">
                      {course.price > 0 ? (
                        <span className="text-2xl font-bold text-blue-600">
                          ${course.price}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Free Course
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEnrollInCourse(course.id)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      Enroll Now
                    </button>
                    <button
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-100 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                No courses available
              </h3>
              <p className="text-slate-600 mb-6">
                Check back later for new courses or contact your administrator
              </p>
              <button
                onClick={fetchStudentData}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                Refresh Courses
              </button>
            </div>
          )}
        </div>

        {/* No enrollments message */}
        {enrollments.length === 0 && availableCourses.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-100 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              Welcome to EduLearn!
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              No courses are available yet. Contact your administrator or check
              back later for exciting learning opportunities.
            </p>
            <button
              onClick={fetchStudentData}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              Check for Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
