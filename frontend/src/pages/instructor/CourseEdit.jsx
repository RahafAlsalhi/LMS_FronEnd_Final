"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseById } from "../store/slices/courseSlice";
import httpClient from "../services/httpClient";

const CourseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCourse, isLoading } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category_id: "",
    is_published: false,
    thumbnail_url: "",
  });

  // UI state
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchCourseById(id));
      fetchCategories();
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentCourse) {
      // Check if user owns this course
      if (currentCourse.instructor_id !== user?.id) {
        navigate("/unauthorized");
        return;
      }

      setFormData({
        title: currentCourse.title || "",
        description: currentCourse.description || "",
        price: currentCourse.price || "",
        category_id: currentCourse.category_id || "",
        is_published: currentCourse.is_published || false,
        thumbnail_url: currentCourse.thumbnail_url || "",
      });
    }
  }, [currentCourse, user, navigate]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await httpClient.get("/categories");
      setCategories(response?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Course title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Course description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters long";
    }

    if (
      formData.price &&
      (isNaN(formData.price) || parseFloat(formData.price) < 0)
    ) {
      newErrors.price = "Price must be a valid positive number";
    }

    if (!formData.category_id) {
      newErrors.category_id = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const updateData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : 0,
      };

      await httpClient.put(`/courses/${id}`, updateData);

      setSuccessMessage("Course updated successfully!");

      // Refresh course data
      dispatch(fetchCourseById(id));

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error updating course:", error);
      setErrors({
        general:
          error.response?.data?.message ||
          "Failed to update course. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    try {
      setSaving(true);
      const newPublishStatus = !formData.is_published;

      await httpClient.put(`/courses/${id}`, {
        ...formData,
        is_published: newPublishStatus,
        price: formData.price ? parseFloat(formData.price) : 0,
      });

      setFormData((prev) => ({ ...prev, is_published: newPublishStatus }));
      setSuccessMessage(
        `Course ${newPublishStatus ? "published" : "unpublished"} successfully!`
      );

      dispatch(fetchCourseById(id));
    } catch (error) {
      console.error("Error toggling publish status:", error);
      setErrors({
        general: "Failed to update publish status. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/courses/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 text-lg">Loading course...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-3">
              Course Not Found
            </h2>
            <p className="text-red-700 mb-6">
              The course you're trying to edit doesn't exist.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div className="flex items-center mb-4 sm:mb-0">
              <button
                onClick={handleGoBack}
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
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Edit Course
                </h1>
                <p className="text-slate-600 mt-1">{currentCourse.title}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleTogglePublish}
                disabled={saving}
                className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.is_published
                    ? "bg-red-100 text-red-700 hover:bg-red-200 border border-red-300"
                    : "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                } disabled:opacity-50`}
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
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
                      d={
                        formData.is_published
                          ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          : "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      }
                    />
                  </svg>
                )}
                {formData.is_published ? "Unpublish" : "Publish"}
              </button>

              <button
                type="submit"
                form="course-edit-form"
                disabled={saving}
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-green-800">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
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
              <span className="text-red-800">{errors.general}</span>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <form
              id="course-edit-form"
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/* Course Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Course Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.title
                      ? "border-red-300 bg-red-50"
                      : "border-slate-300 hover:border-slate-400"
                  }`}
                  placeholder="Enter course title..."
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Course Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Course Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                    errors.description
                      ? "border-red-300 bg-red-50"
                      : "border-slate-300 hover:border-slate-400"
                  }`}
                  placeholder="Describe what students will learn in this course..."
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Price and Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Price */}
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Course Price (USD)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      className={`w-full pl-8 pr-4 py-3 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.price
                          ? "border-red-300 bg-red-50"
                          : "border-slate-300 hover:border-slate-400"
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-600">{errors.price}</p>
                  )}
                  <p className="mt-2 text-sm text-slate-500">
                    Leave empty or set to 0 for free courses
                  </p>
                </div>

                {/* Course Category */}
                <div>
                  <label
                    htmlFor="category_id"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Course Category *
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    disabled={loadingCategories}
                    className={`w-full px-4 py-3 border rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.category_id
                        ? "border-red-300 bg-red-50"
                        : "border-slate-300 hover:border-slate-400"
                    } ${
                      loadingCategories ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <option value="">
                      {loadingCategories
                        ? "Loading categories..."
                        : "Select a category"}
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.category_id}
                    </p>
                  )}
                </div>
              </div>

              {/* Course Thumbnail */}
              <div>
                <label
                  htmlFor="thumbnail_url"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Course Thumbnail URL
                </label>
                <input
                  type="url"
                  id="thumbnail_url"
                  name="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-400 transition-colors"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-2 text-sm text-slate-500">
                  Optional: Add a thumbnail image URL for your course
                </p>

                {/* Thumbnail Preview */}
                {formData.thumbnail_url && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      Preview:
                    </p>
                    <div className="w-full max-w-md">
                      <img
                        src={formData.thumbnail_url}
                        alt="Course thumbnail preview"
                        className="w-full h-32 object-cover rounded-lg border border-slate-200"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Publish Status */}
              <div className="border-t border-slate-200 pt-8">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <h3 className="text-lg font-medium text-slate-900">
                      Course Status
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {formData.is_published
                        ? "Your course is live and visible to students"
                        : "Your course is in draft mode and not visible to students"}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_published"
                      name="is_published"
                      checked={formData.is_published}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    />
                    <label
                      htmlFor="is_published"
                      className="ml-3 text-sm font-medium text-slate-700"
                    >
                      Published
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Course Content
            </h3>
            <p className="text-slate-600 mb-4">
              Manage modules, lessons, and course structure.
            </p>
            <button
              onClick={() => navigate(`/instructor/courses/${id}/modules`)}
              className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-3 px-4 rounded-xl transition-colors"
            >
              Manage Content
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Student Analytics
            </h3>
            <p className="text-slate-600 mb-4">
              View enrollment data and student progress.
            </p>
            <button
              onClick={() => navigate(`/instructor/courses/${id}/analytics`)}
              className="w-full bg-green-100 hover:bg-green-200 text-green-700 font-medium py-3 px-4 rounded-xl transition-colors"
            >
              View Analytics
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-red-200 p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">
            Danger Zone
          </h3>
          <div className="border border-red-200 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h4 className="font-medium text-red-900 mb-1">Delete Course</h4>
                <p className="text-sm text-red-700">
                  Once you delete a course, there is no going back. This will
                  remove all content and student data.
                </p>
              </div>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this course? This action cannot be undone."
                    )
                  ) {
                    // Handle delete course
                    console.log("Delete course");
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEdit;
