/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import httpClient from "../../services/httpClient";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    pendingApprovals: 0,
    activeEnrollments: 0,
  });

  const [pendingCourses, setPendingCourses] = useState([]);
  const [pendingInstructors, setPendingInstructors] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug function to test clicks
  const testClick = () => {
    console.log("Test click works!");
    alert("Button click is working!");
  };

  // Instructor approval handler
  const handleInstructorApproval = async (instructorId, approved) => {
    console.log("handleInstructorApproval called:", instructorId, approved);

    // Confirmation dialog
    const action = approved ? "approve" : "reject";
    const instructor = pendingInstructors.find((i) => i.id === instructorId);
    const confirmMessage = approved
      ? `Are you sure you want to approve ${instructor?.name}? They will be able to create courses.`
      : `Are you sure you want to reject ${instructor?.name}? Their account will be permanently deleted.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await httpClient.put(`/users/${instructorId}/approval`, {
        is_approved: approved,
      });

      console.log("Approval response:", response);

      const message = approved
        ? `✅ Instructor ${instructor?.name} has been approved!`
        : `❌ Instructor application rejected and account removed.`;

      alert(message);

      // Refresh data immediately
      await fetchAdminData();
    } catch (error) {
      console.error("Error updating instructor approval:", error);
      alert(
        "❌ Error: " + (error.message || "Failed to update instructor approval")
      );
    }
  };

  // Course approval handler
  const handleCourseApproval = async (courseId, approved) => {
    console.log("handleCourseApproval called:", courseId, approved);

    const course = pendingCourses.find((c) => c.id === courseId);
    const action = approved ? "approve" : "reject";
    const confirmMessage = `Are you sure you want to ${action} the course "${course?.title}"?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await httpClient.put(`/courses/${courseId}`, {
        is_approved: approved,
      });

      console.log("Course approval response:", response);

      const message = approved
        ? `✅ Course "${course?.title}" has been approved and is now visible to students!`
        : `❌ Course "${course?.title}" has been rejected.`;

      alert(message);

      // Refresh data immediately
      await fetchAdminData();
    } catch (error) {
      console.error("Error updating course approval:", error);
      alert(
        "❌ Error: " + (error.message || "Failed to update course approval")
      );
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    console.log("Fetching admin data...");

    try {
      setLoading(true);
      setError(null);

      // Fetch all users
      const usersResponse = await httpClient.get("/users");
      const users = usersResponse || [];
      console.log("Users:", users);

      // Fetch ALL courses (including pending approval)
      const coursesResponse = await httpClient.get(
        "/courses/admin/all-courses"
      );
      const courses = coursesResponse || [];
      console.log("All courses (including pending):", courses);

      // Fetch pending instructors
      const pendingInstructorsResponse = await httpClient.get(
        "/users/pending-instructors"
      );
      const pendingInstructorsList = pendingInstructorsResponse || [];
      console.log("Pending instructors:", pendingInstructorsList);

      // Calculate stats
      setStats({
        totalUsers: users.length,
        totalCourses: courses.length,
        pendingApprovals:
          courses.filter((c) => !c.is_approved).length +
          pendingInstructorsList.length,
        activeEnrollments: 0, // You might want to calculate this properly later
      });

      // Set pending courses (not approved)
      const pendingCoursesList = courses.filter((c) => !c.is_approved);
      console.log("Pending courses:", pendingCoursesList);
      setPendingCourses(pendingCoursesList);

      // Set pending instructors
      setPendingInstructors(pendingInstructorsList);

      // Set recent users (last 5)
      setRecentUsers(users.slice(-5).reverse());
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setError("Failed to load dashboard data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 text-lg">
                Loading admin dashboard...
              </p>
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
                onClick={fetchAdminData}
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
            Admin Dashboard 🛡️
          </h1>
          <p className="text-slate-600">
            Manage your LMS platform and approve content
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-slate-800">
                {stats.totalUsers}
              </span>
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">Total Users</h3>
            <p className="text-sm text-slate-500">Registered platform users</p>
          </div>

          {/* Total Courses */}
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-slate-800">
                {stats.totalCourses}
              </span>
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">Total Courses</h3>
            <p className="text-sm text-slate-500">All courses on platform</p>
          </div>

          {/* Pending Approvals */}
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
                {stats.pendingApprovals}
              </span>
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">
              Pending Approvals
            </h3>
            <p className="text-sm text-slate-500">Awaiting your review</p>
          </div>

          {/* Active Enrollments */}
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
                {stats.activeEnrollments}
              </span>
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">
              Active Enrollments
            </h3>
            <p className="text-sm text-slate-500">
              Students currently learning
            </p>
          </div>
        </div>

        {/* Pending Instructor Approvals */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              Pending Instructor Approvals ({pendingInstructors.length})
            </h2>
            {pendingInstructors.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Requires Action
              </span>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            {pendingInstructors.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
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
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  All Caught Up!
                </h3>
                <p className="text-slate-600">
                  No pending instructor approvals at this time.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">
                          Name
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">
                          Email
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">
                          Date
                        </th>
                        <th className="text-center py-4 px-6 font-semibold text-slate-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pendingInstructors.map((instructor, index) => (
                        <tr
                          key={instructor.id || index}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="font-medium text-slate-800">
                              {instructor.name}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-600">
                            {instructor.email}
                          </td>
                          <td className="py-4 px-6 text-slate-600">
                            {instructor.created_at
                              ? new Date(
                                  instructor.created_at
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  console.log(
                                    "Approve button clicked for:",
                                    instructor.id
                                  );
                                  handleInstructorApproval(instructor.id, true);
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  console.log(
                                    "Reject button clicked for:",
                                    instructor.id
                                  );
                                  handleInstructorApproval(
                                    instructor.id,
                                    false
                                  );
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                Reject
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
                  {pendingInstructors.map((instructor, index) => (
                    <div key={instructor.id || index} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-slate-800 mb-1">
                            {instructor.name}
                          </h3>
                          <p className="text-sm text-slate-600 mb-1">
                            {instructor.email}
                          </p>
                          <p className="text-xs text-slate-500">
                            {instructor.created_at
                              ? new Date(
                                  instructor.created_at
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            handleInstructorApproval(instructor.id, true)
                          }
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleInstructorApproval(instructor.id, false)
                          }
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Pending Course Approvals */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              Pending Course Approvals ({pendingCourses.length})
            </h2>
            {pendingCourses.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Requires Action
              </span>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            {pendingCourses.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
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
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  All Caught Up!
                </h3>
                <p className="text-slate-600">
                  No pending course approvals at this time.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">
                          Course
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">
                          Instructor
                        </th>
                        <th className="text-center py-4 px-6 font-semibold text-slate-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pendingCourses.map((course, index) => (
                        <tr
                          key={course.id || index}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="font-medium text-slate-800">
                              {course.title}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-600">
                            {course.instructor_name}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  console.log(
                                    "Approve course button clicked for:",
                                    course.id
                                  );
                                  handleCourseApproval(course.id, true);
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  console.log(
                                    "Reject course button clicked for:",
                                    course.id
                                  );
                                  handleCourseApproval(course.id, false);
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                Reject
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
                  {pendingCourses.map((course, index) => (
                    <div key={course.id || index} className="p-6">
                      <div className="mb-4">
                        <h3 className="font-medium text-slate-800 mb-1">
                          {course.title}
                        </h3>
                        <p className="text-sm text-slate-600">
                          Instructor: {course.instructor_name}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleCourseApproval(course.id, true)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleCourseApproval(course.id, false)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => (window.location.href = "/admin/categories")}
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Manage Categories
            </button>
            <button
              onClick={fetchAdminData}
              className="bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-6 rounded-xl border border-slate-200 transition-colors flex items-center gap-2"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
