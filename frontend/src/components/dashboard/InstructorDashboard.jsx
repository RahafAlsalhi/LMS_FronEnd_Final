/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import httpClient from "../../services/httpClient";

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingCourseId, setDeletingCourseId] = useState(null); // Track which course is being deleted

  const { user } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    pendingGrading: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.is_approved) {
      fetchInstructorData();
    }
  }, [user]);

  const fetchInstructorData = async () => {
    try {
      setIsRefreshing(true);
      setLoading(true);
      setError(null);

      console.log("Fetching instructor courses for user:", user?.id);

      // Add a small delay to show the loading effect (optional)
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Fetch instructor's own courses using the new endpoint
      const coursesResponse = await httpClient.get(
        "http://localhost:5000/api/courses/instructor/my-courses"
      );
      const instructorCourses = coursesResponse || [];

      console.log("Instructor courses received:", instructorCourses);
      setCourses(instructorCourses);

      // Calculate stats from real data
      const totalStudents = instructorCourses.reduce((acc, course) => {
        return acc + (Number.parseInt(course.enrollments_count) || 0);
      }, 0);

      setStats({
        totalCourses: instructorCourses.length,
        totalStudents: totalStudents,
        pendingGrading: 0, // This would need assignment data
      });

      console.log(" Courses refreshed successfully!");
    } catch (error) {
      console.error("Error fetching instructor data:", error);
      setError("Failed to load dashboard data: " + error.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleCreateCourse = () => {
    if (!user?.is_approved) {
      setError(
        "Your account is pending approval. You cannot create courses yet."
      );
      return;
    }
    navigate("/create-course");
  };

  const handleDeleteCourse = async (courseId, courseTitle) => {
    // Confirmation dialog
    const confirmMessage = `Are you sure you want to delete the course "${courseTitle}"?\n\nThis action cannot be undone and will permanently remove:\n• The course and all its content\n• All student enrollments\n• All progress data\n\nType "DELETE" to confirm:`;

    const userInput = prompt(confirmMessage);

    if (userInput !== "DELETE") {
      if (userInput !== null) {
        alert(
          "Course deletion cancelled. You must type 'DELETE' exactly to confirm."
        );
      }
      return;
    }

    try {
      setDeletingCourseId(courseId);
      console.log(" Attempting to delete course:", courseId);

      // FIXED: Use the correct full URL path
      const response = await httpClient.delete(
        `http://localhost:5000/api/courses/${courseId}`
      );

      console.log("Course deletion response:", response);

      // Show success message
      alert(` Course "${courseTitle}" has been deleted successfully.`);

      // IMPORTANT: Refresh the courses list to reflect the deletion
      console.log(" Refreshing courses list...");
      await fetchInstructorData();

      console.log(" Dashboard refreshed after deletion");
    } catch (error) {
      console.error(" Error deleting course:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete course";
      alert(` Error: ${errorMessage}`);
    } finally {
      setDeletingCourseId(null);
    }
  };

  const getStatusColor = (course) => {
    if (!course.is_approved && !course.is_published) return "warning"; // Pending approval
    if (course.is_approved && !course.is_published) return "info"; // Ready to publish
    if (!course.is_approved && course.is_published) return "error"; // Published but not approved (shouldn't happen)
    return "success"; // Approved and published
  };

  const getStatusText = (course) => {
    if (!course.is_approved && !course.is_published) return "Pending Approval";
    if (course.is_approved && !course.is_published) return " Published";
    if (!course.is_approved && course.is_published)
      return "Published (Pending Approval)";
    return "Published";
  };

  const getStatusBadgeClasses = (course) => {
    const status = getStatusColor(course);
    switch (status) {
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!user?.is_approved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Instructor Dashboard
            </h1>
            <p className="text-slate-600">Manage your courses and students</p>
          </div>

          {/* Pending Approval Alert */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Account Pending Approval
                </h3>
                <p className="text-yellow-700">
                  Your instructor account is pending admin approval. You'll be
                  able to create and manage courses once your account is
                  approved.
                </p>
              </div>
            </div>
          </div>

          {/* Disabled Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* My Courses */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 opacity-60">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <svg
                    className="w-6 h-6 text-gray-400"
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
                <span className="text-2xl font-bold text-gray-400">--</span>
              </div>
              <h3 className="font-semibold text-gray-500 mb-1">My Courses</h3>
              <p className="text-sm text-gray-400">Courses you've created</p>
            </div>

            {/* Total Students */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 opacity-60">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-gray-400">--</span>
              </div>
              <h3 className="font-semibold text-gray-500 mb-1">
                Total Students
              </h3>
              <p className="text-sm text-gray-400">Students enrolled</p>
            </div>

            {/* Pending Grading */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 opacity-60">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-gray-400">--</span>
              </div>
              <h3 className="font-semibold text-gray-500 mb-1">
                Pending Grading
              </h3>
              <p className="text-sm text-gray-400">Assignments to review</p>
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
            Welcome back, {user?.name}! 👨‍🏫
          </h1>
          <p className="text-slate-600">
            Manage your courses and inspire your students
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
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
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* My Courses */}
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
            <h3 className="font-semibold text-slate-700 mb-1">My Courses</h3>
            <p className="text-sm text-slate-500">Courses you've created</p>
          </div>

          {/* Total Students */}
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-slate-800">
                {stats.totalStudents}
              </span>
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">
              Total Students
            </h3>
            <p className="text-sm text-slate-500">
              Students enrolled in your courses
            </p>
          </div>

          {/* Pending Grading */}
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
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-slate-800">
                {stats.pendingGrading}
              </span>
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">
              Pending Grading
            </h3>
            <p className="text-sm text-slate-500">
              Assignments awaiting review
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={handleCreateCourse}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Course
          </button>
          <button
            onClick={fetchInstructorData}
            disabled={isRefreshing}
            className={`
    ${
      isRefreshing
        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
        : "bg-white hover:bg-slate-50 text-slate-700 hover:scale-105"
    } 
    font-medium py-3 px-6 rounded-xl border border-slate-200 
    transition-all duration-200 ease-in-out
    flex items-center gap-2 
    active:scale-95 
    shadow-sm hover:shadow-md
  `}
          >
            <svg
              className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isRefreshing ? "Refreshing..." : "Refresh Courses"}
          </button>
        </div>

        {/* Courses Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">My Courses</h2>
            {courses.length > 0 && (
              <span className="text-sm text-slate-500">
                {courses.length} course{courses.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {courses.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-slate-700">
                        Course Title
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-slate-700">
                        Students
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-slate-700">
                        Status
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-slate-700">
                        Created
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-slate-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {courses.map((course) => (
                      <tr
                        key={course.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div>
                            <h3 className="font-medium text-slate-800 mb-1">
                              {course.title}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {course.category_name}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {course.enrollments_count || 0}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClasses(
                              course
                            )}`}
                          >
                            {getStatusText(course)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center text-sm text-slate-600">
                          {new Date(course.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => navigate(`/courses/${course.id}`)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              View
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteCourse(course.id, course.title)
                              }
                              disabled={deletingCourseId === course.id}
                              className={`
                                ${
                                  deletingCourseId === course.id
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-red-600 hover:bg-red-700"
                                } 
                                text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                flex items-center gap-1
                              `}
                            >
                              {deletingCourseId === course.id ? (
                                <>
                                  <svg
                                    className="w-4 h-4 animate-spin"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                  </svg>
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  Delete
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-slate-100">
                {courses.map((course) => (
                  <div key={course.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-800 mb-1">
                          {course.title}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {course.category_name}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClasses(
                          course
                        )}`}
                      >
                        {getStatusText(course)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                      <span>{course.enrollments_count || 0} students</span>
                      <span>
                        {new Date(course.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/courses/${course.id}`)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                      >
                        View Course
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteCourse(course.id, course.title)
                        }
                        disabled={deletingCourseId === course.id}
                        className={`
                          ${
                            deletingCourseId === course.id
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700"
                          } 
                          text-white py-2 px-4 rounded-lg font-medium transition-colors
                          flex items-center justify-center gap-1 min-w-[100px]
                        `}
                      >
                        {deletingCourseId === course.id ? (
                          <>
                            <svg
                              className="w-4 h-4 animate-spin"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            <span className="text-xs">Deleting...</span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            <span className="text-xs">Delete</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
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
                No courses created yet
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Create your first course to start teaching and sharing your
                knowledge with students.
              </p>
              <button
                onClick={handleCreateCourse}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] flex items-center gap-2 mx-auto"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Your First Course
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
