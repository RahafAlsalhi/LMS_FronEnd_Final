"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseById } from "../store/slices/courseSlice";
import httpClient from "../services/httpClient";
import CourseDetail from "../../pages/CourseDetail";

const InstructorCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCourse, isLoading, error } = useSelector(
    (state) => state.courses
  );
  const { user } = useSelector((state) => state.auth);

  const [courseAnalytics, setCourseAnalytics] = useState({
    enrollments: [],
    totalEnrollments: 0,
    completionRate: 0,
    revenue: 0,
    averageProgress: 0,
  });
  const [modules, setModules] = useState([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (id) {
      dispatch(fetchCourseById(id));
      fetchCourseAnalytics();
      fetchCourseModules();
    }
  }, [dispatch, id]);

  const fetchCourseAnalytics = async () => {
    try {
      setLoadingAnalytics(true);

      // Fetch enrollments for this course
      const enrollmentsResponse = await httpClient.get(
        `/enrollments/course/${id}`
      );
      const enrollments = enrollmentsResponse?.data || [];

      // Calculate analytics
      const totalEnrollments = enrollments.length;
      const completedEnrollments = enrollments.filter(
        (e) => e.progress === 100
      ).length;
      const completionRate =
        totalEnrollments > 0
          ? (completedEnrollments / totalEnrollments) * 100
          : 0;

      // Calculate average progress
      const averageProgress =
        totalEnrollments > 0
          ? enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) /
            totalEnrollments
          : 0;

      // Calculate revenue (if course has price)
      const revenue = currentCourse?.price
        ? totalEnrollments * currentCourse.price
        : 0;

      setCourseAnalytics({
        enrollments,
        totalEnrollments,
        completionRate: Math.round(completionRate),
        revenue,
        averageProgress: Math.round(averageProgress),
      });
    } catch (error) {
      console.error("Error fetching course analytics:", error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchCourseModules = async () => {
    try {
      const response = await httpClient.get(`/modules/course/${id}`);
      setModules(response?.data || []);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  const handleEditCourse = () => {
    navigate(`/instructor/courses/${id}/edit`);
  };

  const handleManageModules = () => {
    navigate(`/instructor/courses/${id}/modules`);
  };

  const handleAddModule = () => {
    navigate(`/instructor/courses/${id}/modules/new`);
  };

  const handleViewStudents = () => {
    navigate(`/instructor/courses/${id}/students`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 text-lg">
                Loading course details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-3">
              Course Not Found
            </h2>
            <p className="text-red-700 mb-6">
              {error ||
                "This course doesn't exist or you don't have access to it."}
            </p>
            <button
              onClick={() => navigate("/instructor/dashboard")}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabsConfig = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "students", name: "Students", icon: "👥" },
    { id: "content", name: "Content", icon: "📚" },
    { id: "settings", name: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div className="flex items-center mb-4 sm:mb-0">
              <button
                onClick={() => navigate("/instructor/dashboard")}
                className="mr-4 p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">
                  {currentCourse.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      currentCourse.is_published
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {currentCourse.is_published ? "✅ Published" : "⏳ Draft"}
                  </span>
                  {currentCourse.category_name && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {currentCourse.category_name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleEditCourse}
                className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Course
              </button>
              <button
                onClick={handleManageModules}
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Manage Content
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabsConfig.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
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
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">
                      Total Students
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {loadingAnalytics
                        ? "..."
                        : courseAnalytics.totalEnrollments}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
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
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">
                      Completion Rate
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {loadingAnalytics
                        ? "..."
                        : courseAnalytics.completionRate}
                      %
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
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
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">
                      Avg. Progress
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {loadingAnalytics
                        ? "..."
                        : courseAnalytics.averageProgress}
                      %
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">
                      Revenue
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      ${loadingAnalytics ? "..." : courseAnalytics.revenue}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Course Description */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    Course Description
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {currentCourse.description || "No description available."}
                  </p>

                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-3">
                      Course Modules
                    </h4>
                    {modules.length > 0 ? (
                      <div className="space-y-2">
                        {modules.slice(0, 3).map((module, index) => (
                          <div
                            key={module.id}
                            className="flex items-center p-3 bg-slate-50 rounded-lg"
                          >
                            <span className="w-6 h-6 bg-blue-100 text-blue-600 text-sm font-medium rounded-full flex items-center justify-center mr-3">
                              {index + 1}
                            </span>
                            <span className="text-slate-700">
                              {module.title}
                            </span>
                          </div>
                        ))}
                        {modules.length > 3 && (
                          <button
                            onClick={handleManageModules}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            View all {modules.length} modules →
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <svg
                          className="w-12 h-12 text-slate-300 mx-auto mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        <p className="text-slate-500 mb-4">
                          No modules created yet
                        </p>
                        <button
                          onClick={handleAddModule}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Add First Module
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleViewStudents}
                      className="w-full flex items-center justify-between p-3 text-left bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-slate-600 mr-3"
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
                        <span className="font-medium text-slate-700">
                          View Students
                        </span>
                      </div>
                      <svg
                        className="w-4 h-4 text-slate-400"
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

                    <button
                      onClick={handleAddModule}
                      className="w-full flex items-center justify-between p-3 text-left bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-slate-600 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span className="font-medium text-slate-700">
                          Add Module
                        </span>
                      </div>
                      <svg
                        className="w-4 h-4 text-slate-400"
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
                </div>

                {/* Course Stats */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Course Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Price</span>
                      <span className="font-semibold text-slate-900">
                        {currentCourse.price > 0
                          ? `$${currentCourse.price}`
                          : "Free"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Created</span>
                      <span className="font-semibold text-slate-900">
                        {new Date(
                          currentCourse.created_at
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Last Updated</span>
                      <span className="font-semibold text-slate-900">
                        {new Date(
                          currentCourse.updated_at
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 sm:mb-0">
                Enrolled Students ({courseAnalytics.totalEnrollments})
              </h3>
              <button
                onClick={() =>
                  navigate(`/instructor/courses/${id}/students/export`)
                }
                className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export Data
              </button>
            </div>

            {courseAnalytics.enrollments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Enrolled Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {courseAnalytics.enrollments.map((enrollment) => (
                      <tr key={enrollment.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-sm">
                                {enrollment.user_name
                                  ?.charAt(0)
                                  .toUpperCase() || "U"}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900">
                                {enrollment.user_name || "Unknown User"}
                              </div>
                              <div className="text-sm text-slate-500">
                                {enrollment.user_email || "No email"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {new Date(
                            enrollment.enrolled_at
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-slate-200 rounded-full h-2 mr-3">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${enrollment.progress || 0}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-slate-900">
                              {enrollment.progress || 0}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              enrollment.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : enrollment.status === "active"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {enrollment.status || "Active"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-slate-300 mx-auto mb-4"
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
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No Students Enrolled Yet
                </h3>
                <p className="text-slate-500 mb-6">
                  Once students enroll in your course, you'll see their progress
                  and details here.
                </p>
                <button
                  onClick={() => navigate(`/instructor/courses/${id}/promote`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Promote Your Course
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "content" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-xl font-bold text-slate-900 mb-4 sm:mb-0">
                Course Content
              </h3>
              <button
                onClick={handleAddModule}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Module
              </button>
            </div>

            {modules.length > 0 ? (
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div
                    key={module.id}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start mb-4 sm:mb-0">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-4 text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900 mb-1">
                            {module.title}
                          </h4>
                          <p className="text-slate-600 mb-2">
                            {module.description}
                          </p>
                          <div className="flex items-center text-sm text-slate-500">
                            <svg
                              className="w-4 h-4 mr-1"
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
                            <span>{module.lessons_count || 0} lessons</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() =>
                            navigate(`/instructor/modules/${module.id}/lessons`)
                          }
                          className="inline-flex items-center justify-center px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View Lessons
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/instructor/modules/${module.id}/edit`)
                          }
                          className="inline-flex items-center justify-center px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                <svg
                  className="w-16 h-16 text-slate-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No Content Yet
                </h3>
                <p className="text-slate-500 mb-6">
                  Start building your course by adding modules and lessons.
                </p>
                <button
                  onClick={handleAddModule}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Create Your First Module
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                Course Settings
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Course Status
                  </label>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">
                        {currentCourse.is_published ? "Published" : "Draft"}
                      </p>
                      <p className="text-sm text-slate-600">
                        {currentCourse.is_published
                          ? "Your course is live and visible to students"
                          : "Your course is in draft mode and not visible to students"}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        /* Handle toggle publish */
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentCourse.is_published
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {currentCourse.is_published ? "Unpublish" : "Publish"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Course Price
                  </label>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">
                        {currentCourse.price > 0
                          ? `${currentCourse.price}`
                          : "Free Course"}
                      </p>
                      <p className="text-sm text-slate-600">
                        {currentCourse.price > 0
                          ? "Students need to pay to enroll"
                          : "Students can enroll for free"}
                      </p>
                    </div>
                    <button
                      onClick={handleEditCourse}
                      className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      Change Price
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Course Category
                  </label>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">
                        {currentCourse.category_name || "No category selected"}
                      </p>
                      <p className="text-sm text-slate-600">
                        Category helps students find your course
                      </p>
                    </div>
                    <button
                      onClick={handleEditCourse}
                      className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      Change Category
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
              <h3 className="text-xl font-bold text-red-900 mb-4">
                Danger Zone
              </h3>
              <div className="border border-red-200 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h4 className="font-medium text-red-900 mb-1">
                      Delete Course
                    </h4>
                    <p className="text-sm text-red-700">
                      Once you delete a course, there is no going back. Please
                      be certain.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      /* Handle delete course */
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Delete Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
