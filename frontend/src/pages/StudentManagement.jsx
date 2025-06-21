import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import httpClient from "../services/httpClient";

const StudentManagement = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // State management
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [courseAnalytics, setCourseAnalytics] = useState(null);
  const [ungradedSubmissions, setUngradedSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [gradeModal, setGradeModal] = useState({
    open: false,
    submission: null,
  });
  const [gradingForm, setGradingForm] = useState({ grade: "", feedback: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [submitting, setSubmitting] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchStudentData();
  }, [courseId]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);

      // Fetch all necessary data in parallel
      const [studentsRes, analyticsRes, ungradedRes] = await Promise.all([
        httpClient.get(`/enrollments/course/${courseId}/details`),
        httpClient.get(`/enrollments/course/${courseId}/analytics`),
        httpClient.get(`/enrollments/course/${courseId}/ungraded`),
      ]);

      const studentsData = studentsRes.data || studentsRes || [];
      const analyticsData = analyticsRes.data || analyticsRes || {};
      const ungradedData = ungradedRes.data || ungradedRes || [];

      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setCourseAnalytics(
        typeof analyticsData === "object" ? analyticsData : {}
      );
      setUngradedSubmissions(Array.isArray(ungradedData) ? ungradedData : []);
    } catch (error) {
      console.error("Error fetching student data:", error);
      console.error("Error response:", error.response);
      // Set empty arrays to avoid undefined errors
      setStudents([]);
      setCourseAnalytics({});
      setUngradedSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle grading submission
  const handleGradeSubmission = async () => {
    if (!gradeModal.submission || !gradingForm.grade) return;

    try {
      setSubmitting(true);
      await httpClient.put(
        `/submissions/grade/${gradeModal.submission.assignment_id}/${gradeModal.submission.user_id}`,
        {
          grade: parseFloat(gradingForm.grade),
          feedback: gradingForm.feedback,
        }
      );

      // Refresh data
      await fetchStudentData();
      setGradeModal({ open: false, submission: null });
      setGradingForm({ grade: "", feedback: "" });
    } catch (error) {
      console.error("Error grading submission:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Download submission file
  const downloadSubmissionFile = async (assignmentId, userId) => {
    try {
      const response = await httpClient.get(
        `/submissions/download/${assignmentId}?userId=${userId}`,
        { responseType: "blob" }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `submission_${assignmentId}_${userId}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  // Filter students based on search and status
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 text-lg">Loading student data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto mt-18">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Student Management
              </h1>
              <p className="text-slate-600">
                Manage enrollments, grades, and track student progress
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <div className="text-2xl font-bold text-blue-600">
                  {students.length}
                </div>
                <div className="text-sm text-slate-600">Total Students</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <div className="text-2xl font-bold text-orange-600">
                  {ungradedSubmissions.length}
                </div>
                <div className="text-sm text-slate-600">Pending Grades</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", label: "Overview", icon: "📊" },
                { id: "students", label: "Students", icon: "👥" },
                { id: "submissions", label: "Submissions", icon: "📝" },
                { id: "analytics", label: "Analytics", icon: "📈" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course Analytics Cards */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                📈 Enrollment Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Enrolled:</span>
                  <span className="font-semibold">
                    {courseAnalytics?.enrollments?.total || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Completed:</span>
                  <span className="font-semibold text-green-600">
                    {courseAnalytics?.enrollments?.completed || 0}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Completion Rate:</span>
                  <span className="font-semibold">
                    {courseAnalytics?.enrollments?.completion_rate || 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                📚 Content Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Modules:</span>
                  <span className="font-semibold">
                    {courseAnalytics?.content?.modules || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Lessons:</span>
                  <span className="font-semibold">
                    {courseAnalytics?.content?.lessons || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Assignments:</span>
                  <span className="font-semibold">
                    {courseAnalytics?.content?.assignments || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Quizzes:</span>
                  <span className="font-semibold">
                    {courseAnalytics?.content?.quizzes || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                📝 Assignment Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Submissions:</span>
                  <span className="font-semibold">
                    {courseAnalytics?.assignments?.total_submissions || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Graded:</span>
                  <span className="font-semibold text-green-600">
                    {courseAnalytics?.assignments?.graded_submissions || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Pending:</span>
                  <span className="font-semibold text-orange-600">
                    {courseAnalytics?.assignments?.pending_grading || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Average Grade:</span>
                  <span className="font-semibold">
                    {courseAnalytics?.assignments?.avg_grade || 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Ungraded Submissions */}
            <div className="md:col-span-2 lg:col-span-3 bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                ⏰ Recent Ungraded Submissions
              </h3>
              {ungradedSubmissions.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-slate-300"
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
                  <p>All submissions are graded! 🎉</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ungradedSubmissions.slice(0, 5).map((submission) => (
                    <div
                      key={submission.submission_id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">
                          {submission.student_name}
                        </div>
                        <div className="text-sm text-slate-600">
                          {submission.assignment_title}
                        </div>
                        <div className="text-xs text-slate-500">
                          Submitted{" "}
                          {new Date(
                            submission.submitted_at
                          ).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setGradeModal({ open: true, submission });
                          setGradingForm({ grade: "", feedback: "" });
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Grade Now
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div>
            {/* Search and Filter Controls */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search students by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Students</option>

                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
              {filteredStudents.length === 0 ? (
                <div className="p-12 text-center">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No Students Found
                  </h3>
                  <p className="text-slate-500">
                    {students.length === 0
                      ? "No students are enrolled in this course yet."
                      : `No students match your search criteria "${searchTerm}".`}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Assignments
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Avg Grade
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.user_id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-blue-600 font-semibold">
                                  {student.user_name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-slate-900">
                                  {student.user_name}
                                </div>
                                <div className="text-sm text-slate-500">
                                  {student.user_email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-full bg-slate-200 rounded-full h-2 mr-3">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${student.progress || 0}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-slate-600">
                                {student.progress || 0}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">
                              {student.submitted_assignments || 0}/
                              {student.total_assignments || 0}
                            </div>
                            <div className="text-xs text-slate-500">
                              submitted
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-900">
                              {student.avg_assignment_grade &&
                              parseFloat(student.avg_assignment_grade) > 0
                                ? `${Math.round(
                                    parseFloat(student.avg_assignment_grade)
                                  )}%`
                                : "N/A"}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => setSelectedStudent(student)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "submissions" && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">
                All Submissions
              </h3>
              <p className="text-slate-600">
                Manage and grade student submissions
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Assignment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {ungradedSubmissions.map((submission) => (
                    <tr
                      key={submission.submission_id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          {submission.student_name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {submission.student_email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          {submission.assignment_title}
                        </div>
                        <div className="text-sm text-slate-500">
                          {submission.lesson_title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          {new Date(
                            submission.submitted_at
                          ).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {submission.submission_url && (
                          <button
                            onClick={() =>
                              downloadSubmissionFile(
                                submission.assignment_id,
                                submission.user_id
                              )
                            }
                            className="text-green-600 hover:text-green-900"
                          >
                            Download
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setGradeModal({ open: true, submission });
                            setGradingForm({ grade: "", feedback: "" });
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Grade
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                📊 Performance Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Completion Rate:</span>
                  <span className="font-semibold text-green-600">
                    {courseAnalytics?.enrollments?.completion_rate || 0}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Quiz Accuracy:</span>
                  <span className="font-semibold text-purple-600">
                    {courseAnalytics?.quizzes?.accuracy_rate || 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                📈 Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Recent Submissions:</span>
                  <span className="font-semibold">
                    {courseAnalytics?.assignments?.recent_submissions || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Recent Quiz Attempts:</span>
                  <span className="font-semibold">
                    {courseAnalytics?.quizzes?.recent_attempts || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student Detail Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-blue-600 font-semibold text-lg">
                        {selectedStudent.user_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">
                        {selectedStudent.user_name}
                      </h3>
                      <p className="text-slate-600">
                        {selectedStudent.user_email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="text-slate-400 hover:text-slate-600"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedStudent.progress}%
                    </div>
                    <div className="text-sm text-slate-600">
                      Overall Progress
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedStudent.submitted_assignments}/
                      {selectedStudent.total_assignments}
                    </div>
                    <div className="text-sm text-slate-600">
                      Assignments Submitted
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedStudent.avg_assignment_grade
                        ? `${Math.round(selectedStudent.avg_assignment_grade)}%`
                        : "N/A"}
                    </div>
                    <div className="text-sm text-slate-600">Average Grade</div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-slate-600">
                    Enrolled on{" "}
                    {new Date(selectedStudent.enrolled_at).toLocaleDateString()}
                  </p>
                  {selectedStudent.completed_at && (
                    <p className="text-green-600 font-medium">
                      Completed on{" "}
                      {new Date(
                        selectedStudent.completed_at
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grade Submission Modal */}
        {gradeModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-800">
                    Grade Submission
                  </h3>
                  <button
                    onClick={() =>
                      setGradeModal({ open: false, submission: null })
                    }
                    className="text-slate-400 hover:text-slate-600"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                {gradeModal.submission && (
                  <div className="mb-6">
                    <div className="bg-slate-50 rounded-xl p-4 mb-4">
                      <h4 className="font-medium text-slate-800 mb-2">
                        Submission Details
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Student:</span>
                          <div className="font-medium">
                            {gradeModal.submission.student_name}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-600">Assignment:</span>
                          <div className="font-medium">
                            {gradeModal.submission.assignment_title}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-600">Submitted:</span>
                          <div className="font-medium">
                            {new Date(
                              gradeModal.submission.submitted_at
                            ).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-600">Max Points:</span>
                          <div className="font-medium">
                            {gradeModal.submission.max_points}
                          </div>
                        </div>
                      </div>
                    </div>

                    {gradeModal.submission.submission_text && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Text Submission:
                        </label>
                        <div className="bg-slate-50 rounded-lg p-4 max-h-32 overflow-y-auto">
                          <p className="text-slate-700 whitespace-pre-wrap">
                            {gradeModal.submission.submission_text}
                          </p>
                        </div>
                      </div>
                    )}

                    {gradeModal.submission.submission_url && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          File Submission:
                        </label>
                        <button
                          onClick={() =>
                            downloadSubmissionFile(
                              gradeModal.submission.assignment_id,
                              gradeModal.submission.user_id
                            )
                          }
                          className="flex items-center text-blue-600 hover:text-blue-800"
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
                          Download Submission File
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Grade (out of {gradeModal.submission?.max_points || 100})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={gradeModal.submission?.max_points || 100}
                      value={gradingForm.grade}
                      onChange={(e) =>
                        setGradingForm((prev) => ({
                          ...prev,
                          grade: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter grade..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Feedback (Optional)
                    </label>
                    <textarea
                      rows={4}
                      value={gradingForm.feedback}
                      onChange={(e) =>
                        setGradingForm((prev) => ({
                          ...prev,
                          feedback: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Provide feedback for the student..."
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
                <button
                  onClick={() =>
                    setGradeModal({ open: false, submission: null })
                  }
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGradeSubmission}
                  disabled={!gradingForm.grade || submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Grading...
                    </>
                  ) : (
                    "Submit Grade"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;
